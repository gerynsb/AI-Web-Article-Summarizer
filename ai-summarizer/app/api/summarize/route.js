import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { url } = await request.json();

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await response.text();
    const $ = cheerio.load(html);
 
    let textContent = '';
    $('p').each((i, el) => {
      textContent += $(el).text() + ' ';
    });

    if (!textContent.trim()) {
      return NextResponse.json({ error: "Teks tidak ditemukan di link tersebut." }, { status: 400 });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
      Kamu adalah asisten analis data ahli.
      Tugas: Rangkum teks artikel di bawah ini menjadi tepat 3 poin temuan utama (gunakan format list html <ul><li>) dan 1 paragraf kesimpulan di akhir.
      Batasan: Gunakan HANYA informasi dari teks. Jangan halusinasi.
      
      Teks Artikel: ${textContent.substring(0, 10000)}
    `;
    const aiResult = await model.generateContent(prompt);
    const summary = aiResult.response.text();

    return NextResponse.json({ summary });

  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan sistem: " + error.message }, { status: 500 });
  }
}