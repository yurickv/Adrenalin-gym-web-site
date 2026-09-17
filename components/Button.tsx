import Link from 'next/link';

type ButtonProps = {
  route: string;
  text: string;
  width?: string;
};

const buttonClass = (width?: string) =>
  `bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600
  hover:to-orange-600 focus:from-red-600 focus:to-orange-600
  rounded-xl p-4 text-mainTitleBlack text-center block active:bg-primary-700
  hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
  shadow-[0_4px_9px_-4px_#3b71ca] dark:shadow-none dark:hover:shadow-none
  ${width ? width : 'w-max'} transition-all duration-200`;

export const Button = ({ route, text, width }: ButtonProps) => {
  if (/^https?:\/\//.test(route)) {
    return (
      <a
        href={route}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass(width)}
      >
        {text}
      </a>
    );
  }

  return (
    <Link href={route} prefetch={true} className={buttonClass(width)}>
      {text}
    </Link>
  );
};
