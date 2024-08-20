
import styles from "./page.module.css";
import client from "../app/lib/apolloClient";
import { gql } from "@apollo/client";
import Link from "next/link";

const QUERY = gql`
  query {
    blogs {
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
    }
    videos {
      data {
        id
        attributes {
          title
          slug
          video_url
          published_date
        }
      }
    }
  }
`;

export default async function HomePage() {
  let data = null;
  let error = null;

  try {
    const result = await client.query({ query: QUERY });
    data = result.data;
  } catch (err) {
    console.error("Apollo Client Error:", err);
    error = err.message;
  }

  return (
    <div className="container">
      <h1 className="blog-title">Blogs</h1>
      {error && <p>Error: {error}</p>}
      <div className="row">
        {data &&
          data.blogs.data.slice(0, 3).map((blog) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={blog.id}>
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
      <h3 className="blog-button">
        <a href="/blogs">
          {" "}
          <button className="btn btn-secondary">View All</button>
        </a>
      </h3>

      <h1 className="blog-title mt-4">Videos</h1>
      <div className="row">
        {data &&
          data.videos.data.slice(0, 3).map((video) => (
            <div className="col-12 col-md-6 col-lg-4 mb-5" key={video.id}>
              <div className="img_card shadow-sm border-light">
                <div className="video-card">
                  <iframe
                    src={video.attributes.video_url}
                    className="video-iframe"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video"
                  />
                </div>
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  href={`/videos/${video.attributes.slug}`}
                  passHref
                  className="p-3"
                >
                  <h2 className="card-title px-3">{video.attributes.title}</h2>
                  <p className="card-text text-muted px-3">
                    {new Date(
                      video.attributes.published_date
                    ).toLocaleDateString()}
                  </p>
                </Link>
              </div>
            </div>
          ))}
        <h3 className="blog-button">
          <a href="/videos">
            <button className="btn btn-secondary">View All</button>
          </a>
        </h3>
      </div>
    </div>
  );
}
