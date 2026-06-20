import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { IStory, IChapter } from '../types';

interface StoryWithAuthor extends IStory { author: { username: string } }

export const generateStoryPDF = (data: { story: StoryWithAuthor; chapters: IChapter[] }, res: Response): void => {
  const doc = new PDFDocument({ margin: 60, size: 'A4', bufferPages: true });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${data.story.title}.pdf"`);
  doc.pipe(res);

  // Cover page
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#1a1a2e');
  doc.fillColor('#e94560').fontSize(36).font('Helvetica-Bold').text('STORYHUB', 60, 80, { align: 'center' });
  doc.fillColor('#ffffff').fontSize(26).text(data.story.title, 60, 150, { align: 'center' });
  doc.fillColor('#a0a0b0').fontSize(16).font('Helvetica').text(`by ${data.story.author.username}`, 60, 210, { align: 'center' });
  doc.fillColor('#e94560').fontSize(13).text(`Category: ${data.story.category}`, 60, 250, { align: 'center' });
  doc.fillColor('#888888').fontSize(11).text(`Generated: ${new Date().toLocaleDateString()}`, 60, 280, { align: 'center' });

  if (data.story.description) {
    doc.addPage();
    doc.fillColor('#333').fontSize(16).font('Helvetica-Bold').text('Description', 60, 60);
    doc.moveTo(60, 82).lineTo(530, 82).strokeColor('#e94560').lineWidth(2).stroke();
    doc.fillColor('#555').fontSize(12).font('Helvetica').text(data.story.description, 60, 100, { width: 470, lineGap: 4 });
  }

  data.chapters.forEach(ch => {
    doc.addPage();
    doc.fillColor('#1a1a2e').fontSize(20).font('Helvetica-Bold').text(`Chapter ${ch.chapter_number}`, 60, 60);
    if (ch.chapter_title) doc.fillColor('#e94560').fontSize(15).text(ch.chapter_title, 60, 88);
    doc.moveTo(60, 115).lineTo(530, 115).strokeColor('#e94560').lineWidth(1).stroke();
    doc.fillColor('#333').fontSize(12).font('Helvetica').text(ch.content || '', 60, 130, { width: 470, lineGap: 6, align: 'justify' });
  });

  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc.fillColor('#aaa').fontSize(9).text(`StoryHub | Page ${i + 1} of ${range.count}`, 60, doc.page.height - 30, { align: 'center' });
  }
  doc.end();
};

export const generateWriterReportPDF = (
  writer: { username: string; email: string },
  stories: Array<{ title: string; category: string; status: string; views: number; likes: unknown[]; createdAt: Date }>,
  res: Response
): void => {
  const doc = new PDFDocument({ margin: 60, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${writer.username}-report.pdf"`);
  doc.pipe(res);

  doc.rect(0, 0, doc.page.width, 100).fill('#1a1a2e');
  doc.fillColor('#e94560').fontSize(28).font('Helvetica-Bold').text('STORYHUB', 60, 25);
  doc.fillColor('#fff').fontSize(14).font('Helvetica').text('Writer Analytics Report', 60, 62);
  doc.fillColor('#333').fontSize(15).font('Helvetica-Bold').text(`Writer: ${writer.username}`, 60, 115);
  doc.fontSize(11).font('Helvetica').fillColor('#666').text(`Email: ${writer.email}`, 60, 138).text(`Date: ${new Date().toLocaleDateString()}`, 60, 155);

  const totalViews = stories.reduce((s, x) => s + x.views, 0);
  const totalLikes = stories.reduce((s, x) => s + x.likes.length, 0);
  const published  = stories.filter(x => x.status === 'published').length;

  doc.moveTo(60, 178).lineTo(530, 178).strokeColor('#e94560').lineWidth(2).stroke();
  doc.fillColor('#1a1a2e').fontSize(14).font('Helvetica-Bold').text('Summary', 60, 188);

  const stats = [
    { label: 'Total Stories', value: stories.length },
    { label: 'Published', value: published },
    { label: 'Total Views', value: totalViews },
    { label: 'Total Likes', value: totalLikes },
  ];
  stats.forEach((stat, i) => {
    const x = 60 + i * 118;
    doc.rect(x, 212, 108, 55).fillColor('#f5f5f5').fill();
    doc.fillColor('#e94560').fontSize(22).font('Helvetica-Bold').text(String(stat.value), x + 8, 218);
    doc.fillColor('#666').fontSize(10).font('Helvetica').text(stat.label, x + 8, 244);
  });

  doc.fillColor('#1a1a2e').fontSize(13).font('Helvetica-Bold').text('Stories', 60, 292);
  doc.moveTo(60, 310).lineTo(530, 310).strokeColor('#e94560').lineWidth(1).stroke();
  doc.fillColor('#333').fontSize(10).font('Helvetica-Bold');
  doc.text('Title', 60, 320).text('Category', 240, 320).text('Status', 340, 320).text('Views', 410, 320).text('Likes', 470, 320);
  doc.moveTo(60, 336).lineTo(530, 336).strokeColor('#ccc').lineWidth(0.5).stroke();

  let y = 346;
  stories.forEach((s, i) => {
    if (y > 720) { doc.addPage(); y = 60; }
    doc.rect(60, y - 2, 470, 18).fillColor(i % 2 === 0 ? '#f9f9f9' : '#fff').fill();
    doc.fillColor('#333').fontSize(9).font('Helvetica');
    doc.text(s.title.substring(0, 28), 60, y);
    doc.text(s.category, 240, y);
    doc.fillColor(s.status === 'published' ? '#27ae60' : '#f39c12').text(s.status, 340, y);
    doc.fillColor('#333').text(String(s.views), 410, y).text(String(s.likes.length), 470, y);
    y += 20;
  });
  doc.end();
};
