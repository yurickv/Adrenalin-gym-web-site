import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import parse from 'html-react-parser';

import { GoBackBtn } from '@/components/blog-page/GoBackBtn';
import { ViewTracker } from '@/app/components/blog-page/ViewTracker';
import { LikeButton } from '@/app/components/blog-page/LikeButton';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import postHttpService from '@/app/_services/post.service';
import FadeIn from '@/components/FadeIn';
import Image from 'next/image';
import profilePic from '../../../public/bg-hero.webp';

type Props = {
  params: { id: string };
};

const BASE_URL = 'https://adrenalin-gym.com.ua';

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await postHttpService.getPostById(params.id);
  const url = `${BASE_URL}/blog/${params.id}`;

  return {
    title: post.title,
    description: post.description,
    keywords: [post.topic, 'Adrenalin gym', 'фітнес', 'спорт'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      images: post.image ? [{ url: post.image, alt: post.title }] : [],
      siteName: 'Adrenalin Gym',
      locale: 'uk_UA',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        'max-snippet': -1,
        'max-image-preview': 'large',
      },
    },
  };
}

async function BlogPage({ params }: Props) {
  const post = await postHttpService.getPostById(params.id);
  if (!post) {
    redirect('/');
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image || undefined,
    keywords: post.topic,
    url: `${BASE_URL}/blog/${params.id}`,
    publisher: {
      '@type': 'Organization',
      name: 'Adrenalin Gym',
      url: BASE_URL,
    },
  };

  return (
    <main>
      <ViewTracker postId={params.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative bg-hero-bg">
        <div className="div-container py-[20px] md:py-[44px]  mx-auto text-center flex flex-col gap-5 md:gap-10 z-10 relative">
          <h3 className="text-left text-white flex gap-2">
            <Link href="/" className="flex gap-2 items-center">
              <HomeIcon />
              <span className="sr-only md:not-sr-only">Adrenalin_gym</span>
            </Link>
            <Link href="/blog" prefetch={true} className="font-semibold">
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
              prefetch={true}
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
            <div className="flex items-center justify-start">
              <LikeButton postId={post.id} initialLikes={post.likes ?? 0} />
            </div>
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
