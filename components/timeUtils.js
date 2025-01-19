export const getTurkeyTime = (eventTime) => {
  // `eventTime` formatı "HH:mm" olarak geliyor (ör. "21:00")
  const [hour, minute] = eventTime.split(':').map(Number);

  // Yeni bir tarih nesnesi oluştur ve saat/minut ekle
  const eventDate = new Date();
  eventDate.setHours(hour + 2, minute); // Türkiye saatine göre 2 saat ekle
  
  
  // Türkiye saati formatında "HH:mm" döndür
  const turkeyTime = eventDate.toTimeString().slice(0, 5);
  return turkeyTime;
};

export const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};