import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen pb-20 container mx-auto px-4 text-gray-300">
      <h1 className="text-4xl font-bold text-[#00ffd5] mb-8">Privacy Policy</h1>
      <div className="space-y-6 max-w-3xl">
        <p className="text-sm text-gray-500">Last updated: November 21, 2025</p>
        
        <section>
          <p className="mb-4">
            At NEXUS ("we," "us," or "our"), accessible from our platform, one of our main priorities is the privacy of our visitors. 
            This Privacy Policy document contains types of information that is collected and recorded by NEXUS and how we use it.
            By using our Service, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">1. Information Collection and Use</h2>
          <p className="mb-2">We collect several different types of information for various purposes to provide and improve our Service to you.</p>
          
          <h3 className="text-xl font-semibold text-[#00ffd5] mt-4 mb-2">Personal Data</h3>
          <p className="mb-2">While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-400">
            <li>Email address</li>
            <li>First name and last name (Username)</li>
            <li>Cookies and Usage Data</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#00ffd5] mt-4 mb-2">Usage Data</h3>
          <p>We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">2. Use of Data</h2>
          <p className="mb-2">NEXUS uses the collected data for various purposes:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-400">
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To provide analysis or valuable information so that we can improve the Service</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">3. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.
            Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">4. Data Security</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">5. Service Providers</h2>
          <p>
            We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
            These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">6. Children's Privacy</h2>
          <p>
            Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">7. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section className="pt-8 border-t border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-3">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
            <br />
            <span className="text-[#00ffd5]">eldoriatheshatteredveil@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
