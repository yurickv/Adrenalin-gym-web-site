import { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/app/_types/post.types';

type Props = {
  title: string;
  post: Post;
  onSubmit: (post: Post) => void;
  setShowModal: (value: boolean) => void;
  setIsPostSubmitted: (value: boolean) => void;
  isPostSubmitted: boolean;
};
const Form = ({
  title,
  post,
  onSubmit,
  setShowModal,
  isPostSubmitted,
  setIsPostSubmitted,
}: Props) => {
  const [form, setForm] = useState<Post>(post);

  const handleElementChange = (element: string, value: string | File) => {
    setForm(prev => ({ ...prev, [element]: value }));
  };
  /// /fotoPost/working-at-abdomen.webp
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50  outline-none focus:outline-none">
        <div className="relative my-6 mx-auto">
          <div className="border-0 px-10 py-6 rounded-lg shadow-lg relative flex flex-col min-w-[1000px] bg-white outline-none focus:outline-none">
            <h3 className="text-3xl font-semibold">{title} post</h3>

            <div className="relative flex-auto flex flex-col">
              <div className="flex flex-col w-full justify-center items-center">
                {typeof form.image === 'string' && form.image && (
                  <Image
                    src={form.image}
                    alt={form.title}
                    width={350}
                    height={230}
                  />
                )}

                <div className="flex gap-3 items-center text-gray-600 text-center">
                  <label
                    htmlFor="image"
                    className="items-center cursor-pointer w-full -mt-1.5"
                  >
                    {' '}
                    Local link to image
                    {/* {form.image ? 'Change image' : 'Upload image'} */}
                  </label>{' '}
                  <input
                    id="image"
                    value={form.image}
                    // type="file"
                    // // onBlur={() => trigger(field.name)}
                    className="min-w-[800px] form-input"
                    onChange={e => {
                      handleElementChange('image', e.target.value);
                    }}

                    // onChange={e => {
                    //   if (e.target.files?.[0]) {
                    //     handleElementChange('image', e.target.files[0]);
                    //   }

                    //   e.target.blur();
                    // }}
                  />
                </div>
              </div>
              <div className="flex gap-3 items-center justify-between">
                <label htmlFor="id" className="-mt-1.5">
                  Id post for route
                </label>
                <input
                  id="id"
                  value={form.id}
                  className="form-input max-w-[800px]"
                  onChange={e => {
                    handleElementChange('id', e.target.value);
                  }}
                />
              </div>
              <div className="flex gap-3 items-center justify-between">
                <label htmlFor="title" className="-mt-1.5">
                  Title
                </label>
                <input
                  id="title"
                  value={form.title}
                  className="form-input max-w-[800px]"
                  onChange={e => {
                    handleElementChange('title', e.target.value);
                  }}
                />
              </div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={form.description}
                onChange={e => {
                  handleElementChange('description', e.target.value);
                }}
                className="form-input"
              />
              <div className="flex gap-3 items-center justify-between">
                <label htmlFor="topic" className="-mt-1.5">
                  Topic (Hashtag)
                </label>
                <select
                  id="topic"
                  value={form.topic}
                  className="form-input max-w-[800px]"
                  onChange={e => {
                    handleElementChange('topic', e.target.value);
                  }}
                >
                  <option value="">-- Select topic --</option>
                  <option value="Training">Training</option>
                  <option value="Motivation">Motivation</option>
                  <option value="Nutrition">Nutrition</option>
                </select>
              </div>
              <label htmlFor="markup">Markup</label>
              <textarea
                id="markup"
                value={form.markup}
                onChange={e => {
                  handleElementChange('markup', e.target.value);
                }}
                className="form-input min-h-[200px]"
              />
            </div>
            <div className="flex items-center justify-end p-3">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                disabled={isPostSubmitted}
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                disabled={isPostSubmitted}
                onClick={() => {
                  setIsPostSubmitted(true);
                  onSubmit(form);
                }}
              >
                {isPostSubmitted ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 mr-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Loading...
                  </>
                ) : (
                  title
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
export default Form;
