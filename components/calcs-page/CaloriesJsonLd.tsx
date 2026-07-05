import { caloriesFaq } from './CaloriesFaq';
import {
  CALC_AUTHOR,
  CALC_PUBLISHER,
  CALC_DATE_PUBLISHED,
  CALC_DATE_MODIFIED,
} from '@/const/calcSeo';

const SITE_URL = 'https://gym-adrenalin.com.ua';
const PAGE_URL = `${SITE_URL}/calcs/calories-calculator`;

export const CaloriesJsonLd = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Калькулятори',
            item: `${SITE_URL}/calcs`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Калькулятор калорій',
            item: PAGE_URL,
          },
        ],
      },
      {
        '@type': 'WebApplication',
        name: 'Калькулятор калорій',
        url: PAGE_URL,
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'UAH' },
        description:
          'Безкоштовний онлайн-калькулятор для розрахунку денної норми калорій за формулою Міффліна-Сан Жеора для схуднення, набору чи утримання ваги.',
        author: CALC_AUTHOR,
        publisher: CALC_PUBLISHER,
        datePublished: CALC_DATE_PUBLISHED,
        dateModified: CALC_DATE_MODIFIED,
        citation: {
          '@type': 'CreativeWork',
          name: 'Здорове харчування — рекомендації Всесвітньої організації охорони здоров’я (ВООЗ)',
          url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
        },
      },
      {
        '@type': 'HowTo',
        name: 'Як розрахувати денну норму калорій',
        description:
          'Покрокова інструкція, як визначити денну потребу калорій за формулою Міффліна-Сан Жеора.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Оберіть стать',
            text: 'Виберіть свою стать — чоловік або жінка.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Введіть дані',
            text: 'Вкажіть вік, зріст у сантиметрах і вагу в кілограмах.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Оберіть активність',
            text: 'Виберіть рівень фізичної активності від сидячого способу життя до дуже високого.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Отримайте результат',
            text: 'Калькулятор покаже денну норму калорій. Для схуднення відніміть 10–15%, для набору ваги — додайте 10–15%.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: caloriesFaq.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
