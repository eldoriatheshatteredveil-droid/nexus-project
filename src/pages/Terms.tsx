import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen pb-20 container mx-auto px-4 text-gray-300">
      <h1 className="text-4xl font-bold text-[#00ffd5] mb-8">Terms of Service</h1>
      <div className="space-y-6 max-w-3xl">
        <p className="text-sm text-gray-500">Last updated: November 21, 2025</p>
        
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the NEXUS website and platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">2. Use License & Restrictions</h2>
          <p className="mb-2">
            Permission is granted to temporarily download one copy of the materials (information or software) on NEXUS's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-400">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on NEXUS's website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p className="mt-2">
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by NEXUS at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">4. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of NEXUS and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of NEXUS.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">5. Disclaimer</h2>
          <p>
            The materials on NEXUS's website are provided on an 'as is' basis. NEXUS makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            Further, NEXUS does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
          <p>
            In no event shall NEXUS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NEXUS's website, even if NEXUS or a NEXUS authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">7. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the State of California and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </section>

        <section className="pt-8 border-t border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-3">Contact Us & DMCA</h2>
          <p>
            For any legal inquiries, or to submit a DMCA takedown request regarding copyright infringement, please contact our designated agent at:
            <br />
            <span className="text-[#00ffd5]">eldoriatheshatteredveil@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
