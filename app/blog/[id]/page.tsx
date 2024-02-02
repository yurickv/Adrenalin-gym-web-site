import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import parse from 'html-react-parser';

import { GoBackBtn } from '@/components/blog-page/GoBackBtn';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import postHttpService from '@/app/_services/post.service';
import FadeIn from '@/components/FadeIn';
import Image from 'next/image';
import profilePic from '../../../public/bg-hero.webp';

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await postHttpService.getPostById(params.id);

  return {
    title: post.title,
    description: post.description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        'max-snippet': -1,
      },
    },
  };
}

async function BlogPage({ params }: Props) {
  const post = await postHttpService.getPostById(params.id);
  if (!post) {
    redirect('/');
  }

  return (
    <main>
      <section className="relative bg-hero-bg">
        <div className="div-container py-[20px] md:py-[44px]  mx-auto text-center flex flex-col gap-5 md:gap-10 z-10 relative">
          <h3 className="text-left text-white flex gap-2">
            <Link href="/" className="flex gap-2 items-center">
              <HomeIcon />
              <span className="sr-only md:not-sr-only">Adrenalin_gym</span>
            </Link>
            <Link href="/blog" className="font-semibold">
              &gt;&nbsp;Блог
            </Link>
            <span className="font-semibold truncate ">&gt; {post.title}</span>
          </h3>
        </div>
        <Image
          alt="Adrenalin gym foto"
          src={profilePic}
          placeholder="blur"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
        />
      </section>
      <section className="py-[40px] md:py-[44px] lg:py-[88px] flex flex-col items-center bg-white dark:bg-darkBody">
        <div className="div-container text-center flex flex-col gap-6 relative">
          <FadeIn>
            <Link
              href={`/blog?topic=${post.topic}`}
              aria-label={post.title}
              className="absolute top-0 right-5 text-right font-poppins text-sm font-semibold text-main
              rounded-full p-4  hover:bg-orange-100 focus:bg-orange-100 dark:hover:bg-mainText dark:focus:bg-mainText cursor-pointer"
            >
              #{post.topic}
            </Link>
          </FadeIn>
          <FadeIn>
            <h1
              className="font-poppins pb-2 mt-[52px] md:mt-0 text-xl md:text-[32px] font-semibold text-mainTitle dark:text-mainTitleBlack
           md:pr-28 line-clamp-4"
            >
              {post.title}
            </h1>
          </FadeIn>
          <FadeIn>
            <p className="description">{post.description}</p>
          </FadeIn>
          <FadeIn>
            <div className="overflow-hidden rounded-lg w-full">
              <Image
                src={post.image}
                alt={post.topic}
                width={800}
                height={600}
                className="!w-full align-middle"
              />
            </div>
          </FadeIn>
          {parse(post.markup)}
        </div>
        <GoBackBtn text="Назад" />
      </section>
    </main>
  );
}

export default BlogPage;
