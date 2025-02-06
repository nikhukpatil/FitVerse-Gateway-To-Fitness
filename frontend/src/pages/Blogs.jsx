import React from 'react'
import Head from '../component/blogs/Head'
import BlogSection from '../component/blogs/BlogSection'
import { Helmet } from 'react-helmet'

const Blogs = () => {
  return (
    <div>
      <Helmet>
        <title>
          Blogs - Fitverse
        </title>
      </Helmet>
      <Head />
      <BlogSection />
    </div>
  )
}

export default Blogs
