interface Props {
  text: string;
  name: string;
  max: number;
  min: number;
  value: string | number;
  setAny: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
}

export const InputSkeleton = ({
  text,
  name,
  max,
  min,
  value,
  setAny,
  onBlur,
  error,
}: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-7 items-center justify-between">
        <label
          htmlFor={`${name}-input`}
          className="font-bold md:text-lg text-mainTitle dark:text-mainTitleBlack"
        >
          {text}
        </label>
        <div className="relative flex pb-1">
          <input
            id={`${name}-input`}
            max={max}
            min={min}
            value={value}
            name={name}
            onChange={setAny}
            type="number"
            onBlur={onBlur}
            className="font-bold md:text-lg rounded-xl border-mainText dark:border-mainTextBlack 
            dark:bg-[#676465] dark:text-mainTitleBlack border-2 py-2 pr-2 pl-6 text-center max-w-[120px]
             hover:border-main focus:ring-2 focus:ring-main outline-none"
          />
          {error && (
            <p className="absolute left-2.5 bottom-0 text-red-500 text-xs  bg-white  rounded-xl max-w-[100px]">
              {error}
            </p>
          )}
        </div>
      </div>

      <input
        aria-label={`${text} повзунок`}
        max={max}
        min={min}
        name={name}
        value={value}
        onChange={setAny}
        type="range"
        onBlur={onBlur}
        className="bg-[#D9D9D9] appearance-none rounded-xl  outline-none overflow-hidden"
      />
    </div>
  );
};
