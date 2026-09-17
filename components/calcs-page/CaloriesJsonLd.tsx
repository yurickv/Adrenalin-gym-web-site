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
          'Безкоштовний онлайн-калькулятор калорій: базовий обмін (BMR) і денна норма за формулою Міффліна-Сан Жеора, цільові калорії для схуднення, підтримання чи набору ваги і розрахунок БЖВ.',
        inLanguage: 'uk',
        featureList: [
          'Базовий обмін речовин (BMR)',
          'Денна норма калорій за рівнем активності',
          'Дефіцит 10, 15 і 20% для схуднення',
          'Профіцит 10 і 15% для набору ваги',
          'Білки, жири і вуглеводи для обраної мети',
        ],
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
          'Покрокова інструкція, як визначити норму калорій, дефіцит для схуднення і БЖВ за формулою Міффліна-Сан Жеора.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Оберіть стать',
            text: 'Виберіть свою стать — жінка або чоловік.',
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
            name: 'Оберіть мету',
            text: 'Схуднути, підтримати або набрати вагу — калькулятор підсвітить потрібний рядок.',
          },
          {
            '@type': 'HowToStep',
            position: 5,
            name: 'Отримайте результат',
            text: 'Калькулятор покаже BMR, норму, цільові калорії для всіх варіантів і БЖВ для вашої мети.',
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
