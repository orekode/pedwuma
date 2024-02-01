

import React from 'react';
import ImageBg from '../../components/ImageBg';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';


const Faq = () => {
    const faqs = [
        {
            title: 'What is Pedwuma?',
            content: `
                Pedwuma originates from Akan language in Ghana meaning “Job search”. 
            `,
        },

        {
            title: 'Is Pedwuma free for its users?',
            content: `
                Pedwuma is free for its users. No financial obligation comes with using PEDWUMA for job searches or job postings.
            `,
        },

        {
            title: 'How does Pedwuma work?',
            content: `
                Pedwuma.com uses modern technology to connect workers (service providers) and customers. PEDWUMA uses picture identification on user profiles, customer reviews, ratings, email verification, and mobile phones to ensure we have real people, not robots.
            `,
        },

        {
            title: 'Do I get charges for posting a Job?',
            content: `
                No financial charges comes with job searches or postings.
            `,
        },

        {
            title: 'How do I know I have fair price for a service request?',
            content: `
                Fair pricing: Pedwuma allows its users to compare prices from different service providers to help customers commit to prices that meet their budget. 
            `,
        },

        {
            title: 'What should I register as?',
            content: `
                Users can register as a worker (Service provider) or a regular customer (in need of a service worker)
            `,
        },

        {
            title: 'Who can sign up?',
            content: `
                Pedwuma is open to all people of legal age who require services for their project. Workers in professional environments can advertise themselves for part-time jobs and handypersons. For example, nurses, doctors, teachers, caterers, carpenters, roofers, Electronic repairers, etc., can advertise on Pedwuma.com to attract customers who need their services.
            `,
        },

        {
            title: 'How do I get notified if someone need my service?',
            content: `
                Pedwuma.com uses users’ telephone numbers and email on file to contact service providers and customers for business. Frequently check your phone and email for job notifications. Customers may reach you via email, phone or through a live chat.
            `,
        },

                {
            title: 'What phone do I need to use Pedwuma?',
            content: `
                Downloadable mobile apps for Android or iPhones
            `,
        },

        {
            title: 'Can I get a job?',
            content: `
                People in need of jobs can visit the app to see JOBS (available jobs) and reach out to job posters for negotiation.
            `,
        },
        {
            title: 'How far is a service provider from me?',
            content: `
                Pedwuma.com your address to find the nearest location service providers or customers in your area.
            `,
        },

        {
            title: 'What happens to my information?',
            content: `
                Your information is secured with our app. Data is only used for intended purposes, i.e., connecting with customers, reviews, ratings, live chat, etc. Pedwuma takes its confidentiality with customers’ data seriously, and unauthorized disclosures by staff or any individual are not tolerated.
            `,
        },
    ];
  return (
    <div>
        <section className=" fixed top-0 left-0 w-full h-full z-[-1]">
            <ImageBg image={'/images/kente.webp'} classname='h-full w-full'>
            </ImageBg>
            <div className="absolute top-0 left-0 h-full w-full bg-black bg-opacity-50 backdrop-blur "></div>
        </section>

        <section className='min-h-screen'>
            <div className="text-center text-4xl font-black text-white p-16">
                FREQUENTLY ASKED QUESTIONS
            </div>
            <div className="max-w-[900px] bg-white mx-auto min-h-screen rounded shadow">
                <div>
                    {faqs.map( (item, index) => 
                    
                        <Accordion key={index}>
                            <AccordionSummary
                            expandIcon={<i className="bi bi-chevron-down" />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <Typography>
                                <div className="font-bold text-lg p-4">{item.title}</div>
                            </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <div className="text-lg pt-0 p-4">{item.content}</div>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )}
                </div>
            </div>
        </section>
    </div>
  )
}

export default Faq