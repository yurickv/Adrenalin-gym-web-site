import { imtFaq } from './ImtFaq';
import {
  CALC_AUTHOR,
  CALC_PUBLISHER,
  CALC_DATE_PUBLISHED,
  CALC_DATE_MODIFIED,
} from '@/const/calcSeo';

const SITE_URL = 'https://gym-adrenalin.com.ua';
const PAGE_URL = `${SITE_URL}/calcs/imt-calculator`;

export const ImtJsonLd = () => {
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
            name: 'Калькулятор індексу маси тіла',
            item: PAGE_URL,
          },
        ],
      },
      {
        '@type': 'WebApplication',
        name: 'Калькулятор індексу маси тіла (ІМТ)',
        url: PAGE_URL,
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'UAH' },
        description:
          'Безкоштовний онлайн-калькулятор для розрахунку індексу маси тіла (ІМТ) за вагою та зростом з оцінкою, чи вага в нормі.',
        author: CALC_AUTHOR,
        publisher: CALC_PUBLISHER,
        datePublished: CALC_DATE_PUBLISHED,
        dateModified: CALC_DATE_MODIFIED,
        citation: {
          '@type': 'CreativeWork',
          name: 'Класифікація індексу маси тіла за даними Всесвітньої організації охорони здоров’я (ВООЗ)',
          url: 'https://www.who.int/health-topics/obesity',
        },
      },
      {
        '@type': 'HowTo',
        name: 'Як розрахувати індекс маси тіла (ІМТ)',
        description:
          'Покрокова інструкція, як визначити індекс маси тіла за вагою та зростом.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Виміряйте параметри',
            text: 'Зважтеся та виміряйте свій зріст.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Введіть дані',
            text: 'Вкажіть вагу в кілограмах і зріст у сантиметрах у калькуляторі.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Отримайте результат',
            text: 'Калькулятор покаже значення ІМТ; порівняйте його з таблицею категорій, щоб дізнатися, чи вага в нормі.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: imtFaq.map(item => ({
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
