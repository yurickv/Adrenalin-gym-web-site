export default function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: 'Тренажерний зал Адреналін',
    alternateName: 'Adrenalin Gym',
    description:
      'Просторий тренажерний зал у Тернополі, мікрорайон БАМ, Тинда, Варшавський. В спортзалі є  силові і кардіо тренажери, боксерська груша, персональний тренер, програми тренувань та харчування для схуднення і набору маси.',
    url: 'https://gym-adrenalin.com.ua',
    telephone: '+380978836689',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'вул. Академіка Сахарова, 10',
      addressLocality: 'Тернопіль',
      addressRegion: 'Тернопільська область',
      postalCode: '46023',
      addressCountry: 'UA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.5504811,
      longitude: 25.6447338,
    },
    image: ['https://gym-adrenalin.com.ua/og-image.avif'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '11:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '12:00',
        closes: '19:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/gym.adrenalin/',
      'https://maps.google.com/?cid=9391101059019608605',
    ],
    priceRange: '₴₴',
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Тренажери',
        value: true,
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Кардіозона',
        value: true,
      },
      { '@type': 'LocationFeatureSpecification', name: 'Душові', value: true },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Шкафчики для зберігання речей',
        value: true,
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Персональний тренер',
        value: true,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
