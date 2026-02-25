import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
import os 
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')

genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-2.5-flash')

def ekstrak_teks_dari_url(url): 
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        paragraf = soup.find_all('p')

        teks_artikel = " ".join([p.get_text(strip=True) for p in paragraf])

        if not teks_artikel:
            return "Teks artikel tidak ditemukan di halaman ini"
        return teks_artikel
    
    except Exception as e: 
        return f'Terjadi kesalahan saat mengekstrak web: {e}'
    
def rangkum_dengan_ai(teks):
    print("Menganalisis dan merangkum teks menggunakan AI...\n")
    
    # Template Prompt Anti-Halusinasi
    prompt = f"""
    Kamu adalah asisten analis data yang teliti dan ahli merangkum teks.
    
    Tugas: Rangkum teks artikel di bawah ini menjadi tepat 3 poin temuan utama (gunakan bullet points) dan 1 kalimat kesimpulan di akhir.
    
    Batasan: 
    - Gunakan HANYA informasi yang ada di dalam teks ini. 
    - Jangan menambahkan opini atau fakta dari luar. 
    - Jika teks di bawah ini tidak berisi informasi yang masuk akal, jawab 'Teks tidak valid untuk dirangkum'.

    Teks Artikel:
    {teks}
    """
    
    try:
        # Mengirimkan prompt ke model AI
        respons = model.generate_content(prompt)
        return respons.text
    except Exception as e:
        return f"Terjadi kesalahan pada AI: {e}"
    
url_target = "https://en.wikipedia.org/wiki/Generative_artificial_intelligence"

print(f"Menarik data dari: {url_target}")
teks_mentah = ekstrak_teks_dari_url(url_target)

if teks_mentah:
    teks_untuk_ai = teks_mentah[:5000]

    hasil_rangkuman = rangkum_dengan_ai(teks_untuk_ai)

    print("HASIL RANGKUMAN")
    print(hasil_rangkuman)
    print("---------------")

else:
    print('Gagal mengambil teks. Proses AI berhenti.')