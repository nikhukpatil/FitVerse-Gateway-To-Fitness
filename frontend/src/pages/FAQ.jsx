import React from 'react';
import { Helmet } from 'react-helmet'

const FAQ = () => {
  return (
    <div>
      <Helmet>
        <title>
          FAQ - Fitverse
        </title>
      </Helmet>
      <section className="relative pt-16 bg-blueGray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-24">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold">Frequently Asked Questions</h2>
              <p className="text-lg leading-relaxed m-4 text-blueGray-500">
                Find answers to some of the most common questions about FitVerse.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full md:w-6/12 px-4">
              <div className="mb-8">
                <h5 className="text-xl font-semibold">How do I calculate my BMI?</h5>
                <p className="mt-2 text-blueGray-500">
                  Use our BMI calculator by entering your height and weight. The calculator will instantly show your BMI.
                </p>
              </div>
              <div className="mb-8">
                <h5 className="text-xl font-semibold">Can I save my BMI results?</h5>
                <p className="mt-2 text-blueGray-500">
                  Yes, you can save your BMI results on your profile and access them anytime you need.
                </p>
              </div>
              <div className="mb-8">
                <h5 className="text-xl font-semibold">What kind of diet plans do you offer?</h5>
                <p className="mt-2 text-blueGray-500">
                  We offer personalized diet plans tailored to your fitness goals, including weight loss, muscle gain, and maintenance.
                </p>
              </div>
            </div>
            <div className="w-full md:w-6/12 px-4">
              <div className="mb-8">
                <h5 className="text-xl font-semibold">Who writes the blog posts?</h5>
                <p className="mt-2 text-blueGray-500">
                  Our blog posts are written by user who are fitness influencers, experts in the field to keep you motivated and informed.
                </p>
              </div>
              <div className="mb-8">
                <h5 className="text-xl font-semibold">Is there a fee to use FitVerse?</h5>
                <p className="mt-2 text-blueGray-500">
                  Basic features like the BMI calculator and access to blogs are free. Premium features like personalized diet plans may require a subscription.
                </p>
              </div>
              <div className="mb-8">
                <h5 className="text-xl font-semibold">How do I contact support?</h5>
                <p className="mt-2 text-blueGray-500">
                  You can contact our support team via the contact form on our website, or by emailing support@fitverse.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;