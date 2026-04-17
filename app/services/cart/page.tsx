'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import { USER_CREDENTIALS_INPUTS } from '@/const/user-crenedtials';
import { CheckedIcon } from '@/components/CheckedIcon';
import { CartLocalStorageService } from '@/app/_services/cartLocalStorageService';
import { SHOPPING_CART } from '@/const/localstorageKeys';
import { newService } from '@/app/_types/services.types';
import { cartValidationSchema } from '@/app/_schemas/cartValidationSchema';
import { BuyButton } from '@/components/service-page/BuyButton';
import Image from 'next/image';
import profilePic from '../../../public/bg-hero.webp';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';

const ShoppingCart = () => {
  const [products, setProducts] = useState<[] | newService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fullPrice, setFullPrice] = useState<number>(0);
  const [empty, setEmpty] = useState<boolean>(false);
  const [data, setData] = useState({
    agreement: false,
    phone: '+380',
    publicOffer: false,
    sender_first_name: '',
    sender_last_name: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(cartValidationSchema),
    defaultValues: data,
    mode: 'onBlur',
  });
  const cartLocalStorageService = new CartLocalStorageService(SHOPPING_CART);

  useEffect(() => {
    const setShoppingCartProducts = () => {
      const storedProducts = cartLocalStorageService.get() as newService[];

      if (!storedProducts?.length) {
        return setEmpty(true);
      }

      setProducts(storedProducts);
      setIsLoading(false);
      setFullPrice(countFullPrice(storedProducts));
    };

    setShoppingCartProducts();
  }, []);

  function countFullPrice(products: newService[]) {
    return products.reduce(
      (acc, currentProduct) =>
        (acc += Number(currentProduct.plan.price) * currentProduct.amount!),
      0
    );
  }

  const onSubmit = () => {};

  const handleIncrementAmount = (product: newService) => {
    const updatedProducts = cartLocalStorageService.set(product);

    setFullPrice(countFullPrice(updatedProducts));

    setProducts(updatedProducts);
  };

  const handleDecrementAmount = (product: newService) => {
    const updatedProducts = cartLocalStorageService.unset(product);

    setProducts(updatedProducts);

    setFullPrice(countFullPrice(updatedProducts));
  };

  const isButtonDisabled =
    Object.values(data).some(value => !value) || Object.keys(errors).length > 0;
  if (empty) {
    return (
      <main>
        <section className="py-[40px] md:py-[44px] lg:py-[88px] bg-white dark:bg-darkBody">
          <div className="div-container relative mx-auto  md:pl-[80px]">
            <div className="bg-white dark:bg-darkBody absolute inset-y-0 left-0 z-10 -skew-x-12 md:w-[350px] lg:w-[450px]"></div>
            <div className="md:absolute left-20 top-5 md:top-1/4 text-mainText dark:text-mainTextBlack  z-20">
              <div className="flex flex-col gap-8 text-center">
                <p className="  md:text-xl lg:text-2xl font-bold">
                  Упс.
                  <br className="md:hidden" /> Ваша корзина <br /> поки що пуста
                </p>
                <p>Тим часом...</p>
                <ul className="flex flex-col gap-2 underline decoration-1 text-lg text-mainTitle dark:text-mainTitleBlack">
                  <li>
                    <Link href="/">Повернутись на головну</Link>
                  </li>
                  <li>
                    <Link href="/calcs">Визначити свою форму</Link>
                  </li>
                  <li>
                    <Link href="/services">Замовити послуги</Link>
                  </li>
                  <li>
                    <Link href="/blog">Почитати блог</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative h-[400px]  w-full md:h-[720px] ">
              <Image
                src="/man-fitness-404.webp"
                alt="Man with dumbells"
                fill
                style={{
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </section>
      </main>
    );
  }
  return (
    <main>
      <section className="relative bg-hero-bg">
        <div className="div-container py-[20px] md:py-[44px] mx-auto text-center flex flex-col gap-5 z-10 relative">
          <h2 className="text-left text-white flex gap-2">
            <Link href="/" className="flex gap-2 items-center">
              <HomeIcon />
              <span className="sr-only md:not-sr-only">Adrenalin_gym</span>
            </Link>
            <Link
              href="/services"
              className="flex gap-2 items-centerz-20 relative"
            >
              <span className="sr-only md:not-sr-only">&gt; Послуги</span>
            </Link>
            <span className="font-semibold"> &gt; Корзина</span>
          </h2>
          <h1 className="title mb-14 text-white">Корзина</h1>
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
      <section className="cart">
        {isLoading ? (
          <b>Зачекайте хвилинку...</b>
        ) : (
          <div className="div-container flex flex-col gap-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="credentials">
                <p className="font-poppins font-medium text-mainText dark:text-mainTextBlack text-center">
                  Послуги спортзалу &quot;Адреналін&quot; в <b>м.Тернопіль</b>
                </p>
                <h2 className="credentials__title">Ваші дані:</h2>
                <div className="credentials__user-info">
                  {USER_CREDENTIALS_INPUTS.map(
                    ({ label, placeholder, name }) => (
                      <label
                        key={label}
                        className="w-full place-self-auto min-h-[90px]"
                      >
                        <span
                          className="credentials__input font-medium text-left mb-2 rounded-lg
                           before:content-['*'] before:text-mainText  before:dark:text-mainTextBlack"
                        >
                          {label}:
                        </span>
                        <input
                          {...register(
                            name as
                              | 'sender_first_name'
                              | 'sender_last_name'
                              | 'phone'
                              | 'publicOffer'
                              | 'agreement'
                          )}
                          onChange={e =>
                            setData(prev => ({
                              ...prev,
                              [name]: e.target.value,
                            }))
                          }
                          value={data[name as keyof typeof data] as string}
                          placeholder={placeholder}
                          className={`credentials__input rounded-lg font-light p-2 bg-transparent border-b transition-colors 
                          border-mainText dark:border-mainTextBlack dark:bg-[#676465] dark:text-mainTitleBlack border-2 ${
                            errors[name as keyof typeof errors]
                              ? '!text-error border-error'
                              : 'border-mainText dark:border-mainTextBlack'
                          }`}
                        />
                        {errors[name as keyof typeof errors] ? (
                          <p className="text-red-500">
                            {errors[name as keyof typeof errors]?.message}
                          </p>
                        ) : null}
                      </label>
                    )
                  )}
                </div>
                <div className="privacy">
                  <label className="privacy__label">
                    <input
                      {...register('agreement')}
                      className="peer visually-hidden"
                      type="checkbox"
                      name="agreement"
                      checked={data.agreement}
                      onChange={() =>
                        setData(prev => ({
                          ...prev,
                          agreement: !prev.agreement,
                        }))
                      }
                    />
                    <CheckedIcon className="privacy__icon" />
                    <span className="privacy__text">
                      Я надаю згоду на &#xa0;
                    </span>
                    <p className="privacy__text">
                      обробку моїх персональних даних
                    </p>
                  </label>
                  <label className="privacy__label">
                    <input
                      {...register('publicOffer')}
                      className="peer visually-hidden"
                      type="checkbox"
                      name="publicOffer"
                      checked={data.publicOffer}
                      onChange={() =>
                        setData(prev => ({
                          ...prev,
                          publicOffer: !prev.publicOffer,
                        }))
                      }
                    />
                    <CheckedIcon className="privacy__icon" />
                    <span className="privacy__text">Я погоджуюсь з &#xa0;</span>
                    <Link href="/oferta" className="privacy__text underline">
                      умовами та публічною офертою
                    </Link>
                  </label>
                </div>
              </div>
            </form>
            <div className="credentials !items-center">
              <h2 className="credentials__title  md:!self-start">
                Ваше замовлення:
              </h2>
              <div className="product-list">
                <div className="table border-collapse table-auto w-full p-2 rounded-lg ">
                  <div className="hidden md:table-header-group ">
                    <div className="table-row bg-neutral-200 dark:bg-mainText p-2 ">
                      <div className="product__title table-cell rounded-l-lg">
                        Послуга:
                      </div>
                      <div className="product__title table-cell">
                        Тривалість:
                      </div>
                      <div className="product__title table-cell">
                        Кількість:
                      </div>
                      <div className="product__title table-cell rounded-r-lg">
                        Сума
                      </div>
                    </div>
                  </div>

                  <div className="table-row-group md:divide-y md:divide-neutral-400">
                    {products.map(product => (
                      <div
                        className="flex flex-col gap-4 text-center md:text-left border-b-2 md:border-b-0 border-neutral-400
                        first:mt-0 mt-6 md:mt-0 md:table-row 
                          "
                        key={product.plan.id}
                      >
                        <div className="product__description table-cell">
                          {product.serviceName}
                        </div>
                        <div className="product__description hidden md:table-cell">
                          {product.plan.availability}
                        </div>
                        <div className="product__description table-cell">
                          <p
                            className="product__description flex justify-center md:justify-start 
                          items-center gap-1 md:gap-4"
                          >
                            <button
                              type="button"
                              onClick={() => handleDecrementAmount(product)}
                              className="p-2 rounded-lg "
                            >
                              -
                            </button>
                            <span className="p-2">{product.amount}</span>
                            <button
                              type="button"
                              onClick={() => handleIncrementAmount(product)}
                              className="p-2 rounded-lg "
                            >
                              +
                            </button>
                          </p>
                        </div>
                        <div className="product__description table-cell">
                          {Number(product.plan.price) * product.amount!} &#8372;
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="full-price">
                <p className="full-price__title">Разом:</p>
                <p className="full-price__description">{fullPrice} &#8372;</p>
              </div>

              <div className="actions">
                {/* <Link
                  href="/services"
                  className="actions__button bg-transparent text-txt-accent hover:text-red-600 focus:text-red-600 transition-colors"
                >
                  Відмінити
                </Link> */}
                <BuyButton
                  props={{ data, products, fullPrice }}
                  disabled={isButtonDisabled}
                  text={'Оплатити'}
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
export default ShoppingCart;
