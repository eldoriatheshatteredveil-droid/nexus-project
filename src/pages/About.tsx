import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="min-h-screen pb-20 container mx-auto px-4 text-gray-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffd5] to-[#ff66cc]">
            About NEXUS
          </span>
        </h1>

        <div className="space-y-8 text-lg">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">The Platform</h2>
            <p>
              NEXUS is a next-generation digital distribution platform designed to bridge the gap between human creativity and artificial intelligence. We provide a curated marketplace for indie developers and AI-generated experiences, fostering a new era of interactive entertainment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Legal Compliance & Public Use</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-sm space-y-4">
              <p>
                <strong>1. Platform Usage Agreement:</strong> NEXUS is a digital distribution platform open for public use by creators ("Developers") and consumers ("Users"). By accessing or using NEXUS, you agree to comply with all applicable local, state, national, and international laws and regulations regarding digital content distribution, intellectual property rights, and online conduct.
              </p>
              <p>
                <strong>2. Intellectual Property Rights:</strong> 
                <br/>
                (a) <strong>Developers:</strong> You retain full ownership of the intellectual property rights to the content you upload. By uploading, you grant NEXUS a worldwide, non-exclusive, royalty-free license to host, display, and distribute your content on the platform.
                <br/>
                (b) <strong>Users:</strong> You are granted a limited, non-exclusive, non-transferable, revocable license to download, install, and use the content for personal, non-commercial entertainment purposes only, subject to these terms and any specific End User License Agreement (EULA) provided by the Developer.
              </p>
              <p>
                <strong>3. Content Liability & Disclaimer:</strong> NEXUS acts solely as an intermediary service provider (ISP) under the Digital Millennium Copyright Act (DMCA) and similar international laws. We do not create, endorse, or guarantee the safety, quality, or legality of third-party content. Users acknowledge that they download and execute software at their own risk. NEXUS expressly disclaims all liability for any damages, data loss, or system instability resulting from the use of third-party software.
              </p>
              <p>
                <strong>4. AI Disclosure & Transparency:</strong> Content marked as "AI Generated" has been created, in whole or in part, with the assistance of artificial intelligence systems. Developers are required to disclose the use of AI in their projects. Users acknowledge the experimental nature of AI-generated software and that such content may produce unpredictable results.
              </p>
              <p>
                <strong>5. Financial Transactions & Taxes:</strong> All financial transactions are processed through secure, encrypted third-party payment gateways. NEXUS automatically deducts a platform fee (Tax) of 0.01% on all transactions to support development and maintenance. Users are responsible for reporting and paying any applicable taxes in their local jurisdiction.
              </p>
              <p>
                <strong>6. Data Privacy & Security:</strong> We are committed to protecting your digital footprint. NEXUS collects only the data necessary for account management, transaction processing, and service improvement. We employ industry-standard encryption and security measures. We do not sell user data to third parties. Please refer to our Privacy Policy for comprehensive details.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Mission Statement</h2>
            <p>
              Our mission is to democratize game development. Whether you are a solo developer coding in a garage or an AI architect training neural networks, NEXUS is your home. We believe in a future where code and creativity merge seamlessly.
            </p>
          </section>

          <section className="pt-8 border-t border-white/10 text-center">
            <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">
              NEXUS PROJECT <span className="text-[#00ffd5] mx-2">•</span> ARCHITECTED BY <span className="text-white hover:text-[#00ffd5] transition-colors cursor-default">NVIOUS SYSTEMS</span>
            </p>
            <p className="text-[10px] text-gray-600 mt-2 font-mono">
              EST. 2025 // SYSTEM VERSION 1.1.3
              <br />
              <span className="opacity-50">Built with the assistance of artificial intelligence tools.</span>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
