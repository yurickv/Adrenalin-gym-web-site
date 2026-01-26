'use client';

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CreatedPost, Post } from '@/app/_types/post.types';
import Form from '@/components/Form';
import postHttpService from '@/app/_services/post.service';
import {
  createPostFormData,
  editPostFormData,
} from '@/app/_helpers/createFormDataForPost';
import { Loader } from '@/components/Loader';
import { PrevNextButton } from '@/components/blog-page/PrevNextButton';
import { Arrow } from '@/components/icons/Arrow-down';
import ReactPaginate from 'react-paginate';

const post = {
  _id: '',
  id: '',
  markup: '',
  topic: '',
  title: '',
  description: '',
  image: '',
};
const Admin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[] | []>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [editedPost, setEditedPost] = useState<Post>(post);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPostSubmitted, setIsPostSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const initPage = async () => {
      const session = await getSession();

      if (!session?.user) {
        router.replace('/');
        return;
      }

      const { posts, pages } = await postHttpService.getPosts({ page });
      setPages(pages);
      setPosts(posts);
      setIsLoading(false);
    };

    initPage();
  }, [page, router]);

  const cutStringTo30Symbols = (string: string) => {
    if (string.length > 30) {
      return string.substring(0, 30) + '...';
    }
    return string;
  };

  const editPostOnSubmit = async (post: Post) => {
    const formData = editPostFormData(post, editedPost);

    try {
      await postHttpService.updatePost(post._id, formData);

      router.refresh();
      window.location.reload();
    } catch (e) {
      console.log(e);
    } finally {
      setShowModal(false);
      setIsPostSubmitted(false);
    }
  };

  const addPostOnSubmit = async (post: CreatedPost) => {
    const formData = createPostFormData(post);

    try {
      await postHttpService.createPost(formData);
      router.refresh();
      window.location.reload();
    } catch (e) {
      console.log(e);
    } finally {
      setShowAddModal(false);
      setIsPostSubmitted(false);
    }
  };

  const deletePostOnSubmit = async (id: string) => {
    const confirmation = confirm('Are you sure?');
    if (confirmation) {
      try {
        await postHttpService.deletePost(id);
        setPosts(prev => prev.filter(post => post.id !== id));
        window.location.reload();
      } catch (e) {
        console.log(e);
      }
    }
  };
  return (
    <section className="pb-36 pt-28 flex flex-col justify-center items-center">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <button
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mb-4"
            onClick={() => {
              setShowAddModal(true);
            }}
          >
            Add post
          </button>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 ">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Topic
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Markup
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr
                  key={post.id}
                  className={` ${
                    index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'
                  } border-b dark:bg-gray-900 dark:border-gray-700`}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {cutStringTo30Symbols(post.title)}
                  </th>

                  <td scope="row" className="px-6 py-4">
                    {cutStringTo30Symbols(post.description)}
                  </td>
                  <td scope="row" className="px-6 py-4">
                    {post.topic}
                  </td>
                  <td scope="row" className="px-6 py-4">
                    {cutStringTo30Symbols(post.markup)}
                  </td>
                  <td scope="row" className="px-6 py-4 flex gap-2 items-center">
                    {
                      <>
                        <button
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          onClick={() => {
                            setEditedPost(post);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="font-medium text-red-600 dark:text-blue-500 hover:underline"
                          onClick={() => deletePostOnSubmit(post._id)}
                        >
                          Delete
                        </button>
                      </>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pages > 0 && (
        <ReactPaginate
          pageCount={pages}
          previousLabel={
            <PrevNextButton
              title="Попередня"
              icon={
                <div className="rotate-180">
                  <Arrow />
                </div>
              }
            />
          }
          forcePage={page - 1}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          nextLabel={<PrevNextButton title="Наступна" icon={<Arrow />} />}
          onPageChange={({ selected }) => {
            console.log(selected);
            setPage(selected + 1);
          }}
          breakLabel="..."
          containerClassName="flex gap-4 justify-center items-center"
          pageLinkClassName="pagination-button"
          activeLinkClassName="isActive"
          renderOnZeroPageCount={null}
        />
      )}
      {showModal && (
        <Form
          title="Edit"
          post={editedPost as Post}
          setShowModal={setShowModal}
          onSubmit={editPostOnSubmit}
          setIsPostSubmitted={setIsPostSubmitted}
          isPostSubmitted={isPostSubmitted}
        />
      )}
      {showAddModal && (
        <Form
          title="Add"
          post={editedPost}
          onSubmit={addPostOnSubmit}
          setShowModal={setShowAddModal}
          setIsPostSubmitted={setIsPostSubmitted}
          isPostSubmitted={isPostSubmitted}
        />
      )}
    </section>
  );
};
export default Admin;
