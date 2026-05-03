'use client';

import React, { useEffect, useState } from 'react';

import { DescriptionText } from './DescriptionText';
import { DetailsAndPriceButtons } from './DetailsAndPriceButtons';
import { PriceTrainingPlan } from './PriceProgram';
import { plansPasses } from '@/const/priceConst';

type ProgramCardProps = {
  onClickMore: (button: 'standart' | 'personal' | 'planTrain') => void;
  isOpen: boolean;
};

export const ProgramCard: React.FC<ProgramCardProps> = ({
  onClickMore,
  isOpen,
}) => {
  const [pass, setPass] = useState(plansPasses[0]);
  const [chosenService, setChosenService] = useState({
    serviceName: plansPasses[0].serviceName,
    plan: plansPasses[0].plans[1],
  });
  const [duration, setDuration] = useState(plansPasses[0].plans[1]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function onToggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  useEffect(() => {
    setChosenService({ serviceName: pass.serviceName, plan: { ...duration } });
  }, [pass, duration]);

  return (
    <div
      id="program"
      className={` ${
        isOpen
          ? '!shadow-[rgba(246,_120,_49,_0.29)_0px_9px_20px] dark:!shadow-[0px_4px_15px_0px_rgba(116,116,116,0.90)]'
          : ''
      } px-4 py-12 md:py-4 lg:py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
      dark:bg-[#676465] dark:shadow-[0px_4px_15px_0px_rgba(116,116,116,0.30)]
        hover:shadow-[rgba(246,_120,_49,_0.29)_0px_9px_20px] dark:hover:shadow-[0px_4px_15px_0px_rgba(116,116,116,0.90)]
        rounded-xl flex flex-col gap-6 basis-1/3 overflow-hidden`}
    >
      <DescriptionText title="План харчування/ тренування" />
      <PriceTrainingPlan service={chosenService} />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label
            htmlFor="quantity"
            className="text-mainTitle dark:text-mainTitleBlack"
          >
            *Програма:
          </label>
          <select
            name="service name"
            className="min-[768px]:max-w-[340px] min-[880px]:max-w-[380px] min-[980px]:max-w-[404px]
        font-bold border border-mainText dark:border-mainTextBlack bg-white dark:bg-[#676465]
        rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-main mt-2 text-mainText dark:text-mainTextBlack"
            value={pass.serviceName}
            onChange={e => {
              const foundedPass = plansPasses.find(
                ({ serviceName }) => serviceName === e.target.value
              );
              if (foundedPass) {
                setPass(foundedPass);
                setDuration(foundedPass.plans[0]);
              }
            }}
          >
            {plansPasses.map(plan => (
              <option value={plan.serviceName} key={plan.serviceName}>
                {plan.serviceName}
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
              const foundPass = pass.plans.find(
                plan => plan.id === e.target.value
              );
              if (foundPass) {
                setDuration(foundPass);
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
        chosenProduct={chosenService}
        onClickMore={onClickMore}
        name="planTrain"
        isOpen={isOpen}
        onToggleModal={onToggleModal}
        isModalOpen={isModalOpen}
      />
    </div>
  );
};
