'use client';

import React, { useEffect, useState } from 'react';

import { DescriptionText } from './DescriptionText';
import { PriceTraining } from './PriceTraining';
import { DetailsAndPriceButtons } from './DetailsAndPriceButtons';
import { subscriptionPasses } from '@/const/priceConst';

type TrainingCardProps = {
  onClickMore: (button: 'standart' | 'personal' | 'planTrain') => void;
  isOpen: boolean;
};

export const TrainingCard: React.FC<TrainingCardProps> = ({
  onClickMore,
  isOpen,
}) => {
  const [pass, setPass] = useState(subscriptionPasses[2]);
  const [chosenService, setChosenService] = useState({
    serviceName: subscriptionPasses[2].serviceName,
    plan: subscriptionPasses[2].plans[0],
  });
  const [duration, setDuration] = useState(subscriptionPasses[2].plans[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function onToggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  useEffect(() => {
    setChosenService({ serviceName: pass.serviceName, plan: { ...duration } });
  }, [pass, duration]);

  return (
    <div
      id="training"
      className={` ${
        isOpen
          ? '!shadow-[rgba(246,_120,_49,_0.29)_0px_9px_20px] dark:!shadow-[0px_4px_15px_0px_rgba(116,116,116,0.90)]'
          : ''
      } px-4 py-12 md:py-4 lg:py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] 
      dark:bg-[#676465] dark:shadow-[0px_4px_15px_0px_rgba(116,116,116,0.30)]
      hover:shadow-[rgba(246,_120,_49,_0.29)_0px_9px_20px] dark:hover:shadow-[0px_4px_15px_0px_rgba(116,116,116,0.90)]
      rounded-xl flex flex-col gap-6 hover:shrink basis-1/3 overflow-hidden`}
    >
      <DescriptionText title="Тренування" />
      <PriceTraining service={chosenService} />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label
            htmlFor="quantity"
            className="text-mainTitle dark:text-mainTitleBlack"
          >
            *Кількість занять:
          </label>
          <select
            name="quantity"
            className="min-[768px]:max-w-[340px] min-[880px]:max-w-[380px] min-[980px]:max-w-[404px]
        font-bold border border-mainText dark:border-mainTextBlack bg-white dark:bg-[#676465]
         rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-main mt-2 text-mainText dark:text-mainTextBlack"
            value={pass.serviceName}
            onChange={e => {
              const foundService = subscriptionPasses.find(
                pass => pass.serviceName === e.target.value
              );
              if (foundService) {
                setPass(foundService);
                setDuration(foundService.plans[0]);
              }
            }}
          >
            {subscriptionPasses.map(({ serviceName }) => (
              <option value={serviceName} key={serviceName}>
                {serviceName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col ">
          <label
            htmlFor="duration"
            className="text-mainTitle dark:text-mainTitleBlack"
          >
            *Тривалість:
          </label>
          <select
            name="duration"
            disabled={pass.plans.length < 2}
            className="min-[768px]:max-w-[340px] min-[880px]:max-w-[380px] min-[980px]:max-w-[404px]
        font-bold border border-mainText dark:border-mainTextBlack bg-white dark:bg-[#676465]
        rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-main mt-2 text-mainText dark:text-mainTextBlack"
            value={duration.id}
            onChange={e => {
              const foundPlan = pass.plans.find(
                ({ id }) => id === e.target.value
              );
              if (foundPlan) {
                setDuration(foundPlan);
              }
            }}
          >
            {pass.plans.map(({ id, availability }) => (
              <option value={id} key={id}>
                {availability}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DetailsAndPriceButtons
        onClickMore={onClickMore}
        name="standart"
        isOpen={isOpen}
        chosenProduct={chosenService}
        onToggleModal={onToggleModal}
        isModalOpen={isModalOpen}
      />
    </div>
  );
};
