import client from "../lib/apolloClient";
import { gql } from "@apollo/client";
import Pagination from "../components/Pagination";
import Filter from "../components/Filter";
import Link from "next/link";

const BLOGS_QUERY = gql`
  query($start: Int, $limit: Int, $search: String) {
    blogs(
      pagination: { start: $start, limit: $limit }
      filters: { title: { containsi: $search } }
    ) {
      data {
        id
        attributes {
          title
          slug
          img_url
          published_date
          read_time
        }
      }
      meta {
        pagination {
          total
        }
      }
    }
  }
`;

const LIMIT = 4;

export default async function BlogsPage({ searchParams }) {
  const currentPage = parseInt(searchParams.page) || 1;
  const search = searchParams.search || "";
  const start = (currentPage - 1) * LIMIT;

  let data = null;
  let error = null;

  try {
    const result = await client.query({
      query: BLOGS_QUERY,
      variables: { start, limit: LIMIT, search },
    });
    data = result.data;
  } catch (err) {
    console.error("Apollo Client Error:", err);
    error = err.message;
  }

  const totalItems = data?.blogs?.meta?.pagination?.total || 0;
  const totalPages = Math.ceil(totalItems / LIMIT);

  return (
    <div className="container">
      <h1>Blogs</h1>
      <Filter initialSearch={search} />
      {error && <p>Error: {error}</p>}
      <div className="row">
        {data &&
          data.blogs.data.map((blog) => (
            <div className="col-12 col-md-6 mb-4" key={blog.id}>
              <div className="img_card shadow-sm border-light">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  href={`/blogs/${blog.attributes.slug}`}
                  passHref
                >
                  <img
                    className="card-img-top"
                    src={blog.attributes.img_url}
                    alt={blog.attributes.title}
                  />
                  <div className="card-body p-3">
                    <h2 className="card-title">{blog.attributes.title}</h2>
                    <p className="card-text text-muted">
                      <small>
                        {new Date(
                          blog.attributes.published_date
                        ).toLocaleDateString()}
                      </small>
                    </p>
                    <p className="card-text">
                      <strong>Read Time:</strong> {blog.attributes.read_time}{" "}
                      minutes
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} path="blogs"/>
    </div>
  );
}
