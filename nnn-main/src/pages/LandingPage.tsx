import { motion } from 'framer-motion';
import {
  Activity,
  Shield,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  ArrowRight,
  QrCode,
  Lock,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-teal-500 opacity-10"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Own Your Health.{' '}
                <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Securely. Everywhere.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                MediChain gives you full control of your medical records with Hedera's decentralized
                technology. Your health data, your rules.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="#demo"
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all text-center"
                >
                  See Demo
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl shadow-2xl flex items-center justify-center">
                <Activity className="h-32 w-32 text-blue-600 opacity-50" />
                <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                  <Shield className="h-8 w-8 text-teal-500" />
                </div>
                <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="problems" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Problem We Solve</h2>
            <p className="text-xl text-gray-600">
              Healthcare systems today face critical challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500"
            >
              <div className="flex items-start space-x-4">
                <XCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Repeated Tests = Wasted Money</h3>
                  <p className="text-gray-600">
                    Patients waste money on duplicate tests because past results aren't accessible across
                    facilities.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500"
            >
              <div className="flex items-start space-x-4">
                <XCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Lost or Falsified Records</h3>
                  <p className="text-gray-600">
                    Paper records get lost, damaged, or altered. Digital systems lack tamper-proof audit trails.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500"
            >
              <div className="flex items-start space-x-4">
                <XCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Medical Errors from Missing History</h3>
                  <p className="text-gray-600">
                    Without verified allergies and medications, doctors risk dangerous drug interactions and
                    misdiagnoses.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500"
            >
              <div className="flex items-start space-x-4">
                <XCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">No Patient Control</h3>
                  <p className="text-gray-600">
                    Hospitals control your data. Patients can't easily access, share, or revoke access to their
                    own records.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="solutions" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Solution</h2>
            <p className="text-xl text-gray-600">
              MediChain puts patients back in control with blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-teal-50 p-8 rounded-xl shadow-lg border-l-4 border-teal-500"
            >
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-8 w-8 text-teal-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Patient-Owned Digital Identity</h3>
                  <p className="text-gray-700">
                    You control your health data through your own decentralized ID on Hedera.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-teal-50 p-8 rounded-xl shadow-lg border-l-4 border-teal-500"
            >
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-8 w-8 text-teal-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Immutable Record Storage</h3>
                  <p className="text-gray-700">
                    Records stored on IPFS with metadata on Hedera can't be altered or deleted without proof.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-teal-50 p-8 rounded-xl shadow-lg border-l-4 border-teal-500"
            >
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-8 w-8 text-teal-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Permissioned Access Controls</h3>
                  <p className="text-gray-700">
                    Grant or revoke access to doctors and hospitals with a single click.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-teal-50 p-8 rounded-xl shadow-lg border-l-4 border-teal-500"
            >
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-8 w-8 text-teal-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Emergency QR Access</h3>
                  <p className="text-gray-700">
                    Life-saving info instantly available through secure emergency QR codes.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-gray-600">Everything you need for secure health records</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Lock,
                title: 'Patient Ownership',
                description: 'You decide who accesses your data',
              },
              {
                icon: Users,
                title: 'Hospital Efficiency',
                description: 'No repeated tests, faster treatment',
              },
              {
                icon: FileText,
                title: 'Immutable Audit Trails',
                description: 'Every update is logged on Hedera',
              },
              {
                icon: QrCode,
                title: 'Emergency QR Access',
                description: 'Critical info available instantly',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="bg-white p-8 rounded-xl shadow-lg text-center cursor-pointer"
              >
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to secure health records</p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-teal-500 transform -translate-y-1/2 hidden lg:block"></div>

            <div className="grid lg:grid-cols-4 gap-8 relative">
              {[
                {
                  step: '1',
                  title: 'Patient Logs In',
                  description: 'Connect with Hedera wallet',
                },
                {
                  step: '2',
                  title: 'Clinic Uploads Record',
                  description: 'Encrypted on IPFS + Hedera metadata',
                },
                {
                  step: '3',
                  title: 'Patient Grants Access',
                  description: 'Via smart contract permission',
                },
                {
                  step: '4',
                  title: 'Doctor Views Record',
                  description: 'Verified and instant access',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-white p-6 rounded-xl shadow-lg relative z-10"
                >
                  <div className="inline-block w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="impact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl opacity-90">Making healthcare better for everyone</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                stat: '40%',
                label: 'Cost Savings',
                description: 'By avoiding duplicate tests',
              },
              {
                icon: Clock,
                stat: '60%',
                label: 'Faster Treatment',
                description: 'With verified history',
              },
              {
                icon: Shield,
                stat: '100%',
                label: 'Patient Ownership',
                description: 'Of health records',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-xl text-center"
              >
                <item.icon className="h-12 w-12 mx-auto mb-4" />
                <div className="text-5xl font-bold mb-2">{item.stat}</div>
                <div className="text-xl font-semibold mb-2">{item.label}</div>
                <p className="opacity-90">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-teal-50 p-12 rounded-2xl shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-6">Your Health, Your Control</h2>
            <p className="text-xl text-gray-600 mb-8">
              Start with MediChain today and take ownership of your medical records
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register?role=patient"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold hover:shadow-2xl transition-all inline-flex items-center justify-center"
              >
                I'm a Patient
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register?role=doctor"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center justify-center"
              >
                I'm a Doctor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
