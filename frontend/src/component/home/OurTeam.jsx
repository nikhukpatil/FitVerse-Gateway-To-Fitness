import React from 'react';

const OurTeam = () => {
  return (
    <div id="team" className="section relative pt-20 pb-8 md:pt-16 bg-white dark:bg-gray-800">
      <div className="container xl:max-w-6xl mx-auto px-4">
        <header className="text-center mx-auto mb-12">
          <h2 className="text-2xl leading-normal mb-2 font-bold text-gray-800 dark:text-gray-100">
            <span className="font-light">Our</span> Team
          </h2>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 100 60"
            style={{ margin: '0 auto', height: '35px' }}
            xmlSpace="preserve"
          >
            <circle
              cx="50.1"
              cy="30.4"
              r="5"
              className="stroke-primary"
              style={{ fill: 'transparent', strokeWidth: 2, strokeMiterlimit: 10 }}
            ></circle>
            <line
              x1="55.1"
              y1="30.4"
              x2="100"
              y2="30.4"
              className="stroke-primary"
              style={{ strokeWidth: 2, strokeMiterlimit: 10 }}
            ></line>
            <line
              x1="45.1"
              y1="30.4"
              x2="0"
              y2="30.4"
              className="stroke-primary"
              style={{ strokeWidth: 2, strokeMiterlimit: 10 }}
            ></line>
          </svg>
        </header>

        <div className="flex flex-wrap flex-row -mx-4 justify-center">
          {[
            {
              name: 'Nikhil Patil',
            //   role: 'Founder CEO',
              imgSrc: 'https://tailone.tailwindtemplate.net/src/img/dummy/avatar1.png',
              twitter: '#',
              facebook: '#',
              instagram: 'https://www.instagram.com/tejas._.patil/',
              linkedin: 'https://www.linkedin.com/in/nikhilpatil0227/',
            },
            // {
            //   name: 'Sarah Daeva',
            //   role: 'Marketing',
            //   imgSrc: 'https://tailone.tailwindtemplate.net/src/img/dummy/avatar3.png',
            //   twitter: '#',
            //   facebook: '#',
            //   instagram: '#',
            //   linkedin: '#',
            // },
            {
              name: 'Harsh Dawani',
            //   role: 'Sales Manager',
              imgSrc: 'https://tailone.tailwindtemplate.net/src/img/dummy/avatar2.png',
              twitter: '#',
              facebook: '#',
              instagram: 'https://www.instagram.com/harsh_dawani/',
              linkedin: 'https://www.linkedin.com/in/harsh-dawani/',
            },
          ].map((member, index) => (
            <div
              key={index}
              className="flex-shrink max-w-full px-4 w-2/3 sm:w-1/2 md:w-5/12 lg:w-1/4 xl:px-6"
            >
              <div
                className={`relative overflow-hidden bg-white dark:bg-gray-800 mb-12 hover-grayscale-0 wow fadeInUp`}
                data-wow-duration="1s"
                style={{ visibility: 'visible', animationDuration: '1s', animationName: 'fadeInUp' }}
              >
                <div className="relative overflow-hidden px-6">
                  <img
                    src={member.imgSrc}
                    className="max-w-full h-auto mx-auto rounded-full bg-gray-50 grayscale"
                    alt={member.name}
                  />
                </div>
                <div className="pt-6 text-center">
                  <p className="text-lg leading-normal font-bold mb-1 text-white">{member.name}</p>
                  <p className="text-gray-500 leading-relaxed font-light">{member.role}</p>

                  <div className="mt-2 mb-5 space-x-2">
                    {/* <a className="hover:text-blue-700" aria-label="Twitter link" href={member.twitter}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block"
                        width="1rem"
                        height="1rem"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M496,109.5a201.8,201.8,0,0,1-56.55,15.3,97.51,97.51,0,0,0,43.33-53.6,197.74,197.74,0,0,1-62.56,23.5A99.14,99.14,0,0,0,348.31,64c-54.42,0-98.46,43.4-98.46,96.9a93.21,93.21,0,0,0,2.54,22.1,280.7,280.7,0,0,1-203-101.3A95.69,95.69,0,0,0,36,130.4C36,164,53.53,193.7,80,211.1A97.5,97.5,0,0,1,35.22,199v1.2c0,47,34,86.1,79,95a100.76,100.76,0,0,1-25.94,3.4,94.38,94.38,0,0,1-18.51-1.8c12.51,38.5,48.92,66.5,92.05,67.3A199.59,199.59,0,0,1,39.5,405.6,203,203,0,0,1,16,404.2,278.68,278.68,0,0,0,166.74,448c181.36,0,280.44-147.7,280.44-275.8,0-4.2-.11-8.4-.31-12.5A198.48,198.48,0,0,0,496,109.5Z"
                        ></path>
                      </svg>
                    </a> */}
                    {/* <a className="hover:text-blue-700" aria-label="Facebook link" href={member.facebook}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block"
                        width="1rem"
                        height="1rem"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M455.27,32H56.73A24.74,24.74,0,0,0,32,56.73V455.27A24.74,24.74,0,0,0,56.73,480H256V304H202.45V240H256V189c0-57.86,40.13-89.36,91.82-89.36,24.73,0,51.33,1.86,57.51,2.68v60.43H364.15c-28.12,0-33.48,13.3-33.48,32.9V240h67l-8.75,64H330.67V480h124.6A24.74,24.74,0,0,0,480,455.27V56.73A24.74,24.74,0,0,0,455.27,32Z"
                        ></path>
                      </svg>
                    </a> */}
                    <a className="hover:text-blue-700" aria-label="Instagram link" href={member.instagram}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block"
                        width="1rem"
                        height="1rem"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M349.33,69.33a93.62,93.62,0,0,1,93.34,93.34V349.33a93.62,93.62,0,0,1-93.34,93.34H162.67a93.62,93.62,0,0,1-93.34-93.34V162.67a93.62,93.62,0,0,1,93.34-93.34H349.33m0-37.33H162.67C90.8,32,32,90.8,32,162.67V349.33C32,421.2,90.8,480,162.67,480H349.33C421.2,480,480,421.2,480,349.33V162.67C480,90.8,421.2,32,349.33,32Z"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M377,192.31A34.69,34.69,0,1,0,342.33,227,34.64,34.64,0,0,0,377,192.31Z"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M256,170.67A85.33,85.33,0,1,0,341.33,256,85.35,85.35,0,0,0,256,170.67Zm0,140.8A55.47,55.47,0,1,1,311.47,256,55.54,55.54,0,0,1,256,311.47Z"
                        ></path>
                      </svg>
                    </a>
                    <a className="hover:text-blue-700" aria-label="Linkedin link" href={member.linkedin}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block"
                        width="1rem"
                        height="1rem"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M417.25,32H94.75A62.77,62.77,0,0,0,32,94.75V417.25A62.77,62.77,0,0,0,94.75,480H417.25A62.77,62.77,0,0,0,480,417.25V94.75A62.77,62.77,0,0,0,417.25,32ZM170.53,401.07H110.7V213.37h59.83ZM140.62,183.8h-.39c-20,0-32.95-13.79-32.95-31.05,0-17.57,13.4-31.1,33.77-31.1s32.94,13.53,33.34,31.1C173.39,170,160.62,183.8,140.62,183.8ZM401.07,401.07H341.24V307.41c0-23.58-8.42-39.68-29.49-39.68-16.07,0-25.64,10.82-29.85,21.23-1.54,3.74-1.94,9-1.94,14.26v97.85H220.13s.79-158.88,0-175.49h59.83v24.86c-0.12.2-.28.4-.39.59H280V244c7.95-12.25,22.17-29.72,54-29.72,39.42,0,68.94,25.84,68.94,81.41Z"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
