import requests
from bs4 import BeautifulSoup

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
    
url_tes = "https://en.wikipedia.org/wiki/Generative_artificial_intelligence"
hasil_teks = ekstrak_teks_dari_url(url_tes)

print("Sebagian teks yang berhasil diekstrak:\n")
# Menampilkan 500 karakter pertama saja agar terminal tidak kepenuhan
print(hasil_teks[:500] + "...")