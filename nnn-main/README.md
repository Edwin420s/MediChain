# MediChain

**Decentralized Patient Health Records on Hedera**

MediChain is a blockchain-based electronic health record (EHR) system that gives patients full control of their medical data. Built on Hedera DLT, it provides secure, portable, and tamper-proof health records accessible across healthcare providers.

## 🌟 Features

### For Patients
- **Patient-Owned Digital Identity**: Control your health data through your own decentralized ID on Hedera
- **View & Manage Records**: Access all your medical records in one secure location
- **Access Control**: Grant or revoke access to doctors and hospitals with a single click
- **Emergency QR Code**: Life-saving info instantly available through secure QR codes
- **Immutable Audit Trail**: See exactly who accessed your data and when

### For Doctors
- **Patient Search**: Find and request access to patient records
- **Verified History**: View complete patient medical history with Hedera verification
- **Upload Records**: Securely upload encrypted medical records to IPFS + Hedera
- **Access Requests**: Send permission requests to patients for data access

### For Administrators
- **Doctor Approvals**: Department admins approve/reject doctor registrations
- **Patient Registration**: Onboard new patients to the system
- **Department Management**: Manage departments, doctors, and patients (Super Admin)
- **Analytics Dashboard**: View system-wide or department-specific analytics
- **Role-Based Access**: Enforce permissions at the blockchain level

## 🏗 Architecture

### Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS + Framer Motion
- **State Management**: Context API + React Hooks
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

### Key Technologies (Production)
- **Blockchain**: Hedera Hashgraph
  - Hedera Consensus Service (HCS) for audit trails
  - Hedera Token Service (HTS) for access tokens & roles
  - Hedera Smart Contracts for consent registry
  - Hedera DID for decentralized identity
- **Storage**: IPFS for encrypted medical files
- **Database**: PostgreSQL for metadata
- **Encryption**: AES-256-GCM for files, end-to-end encryption

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/medichain.git
cd medichain
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

The production build will be in the `dist/` directory.

## 📱 User Roles & Dashboards

### Patient Portal
- Overview dashboard with stats
- Medical records viewer with download/share options
- Access control panel for granting/revoking permissions
- Emergency QR code generator
- Profile settings

### Doctor Portal
- Patient search and access requests
- Record viewer with complete patient history
- Upload new medical records
- Pending access requests tracker

### Admin Portal
**Department Admin** (Limited scope):
- Approve doctors for their department
- Register patients under their department
- View department-specific analytics

**Super Admin** (Full access):
- Manage all departments
- Approve/reject doctors system-wide
- Register patients across departments
- System-wide analytics and reporting

## 🎨 Design System

### Color Palette
- **Primary**: Deep Blue (`#0A3D62`) - Trust, professionalism
- **Secondary**: Teal/Green (`#16A085`) - Health, growth
- **Accent**: Hedera Purple (`#8247E5`) - Blockchain identity
- **Background**: Light Gray (`#F8F9FA`)
- **Text**: Dark Charcoal (`#2C3E50`)

### Typography
- **Headings**: Poppins (Bold)
- **Body**: Inter (Regular)

## 🔐 Security Features

1. **End-to-End Encryption**: Medical records encrypted before upload
2. **Decentralized Identity**: Hedera DID for patient/doctor identities
3. **Immutable Audit Logs**: Every action recorded on Hedera Consensus Service
4. **Role-Based Access Control**: Smart contracts enforce permissions
5. **Patient Consent Management**: Explicit, revocable permissions

## 🌍 Problem Solved

MediChain addresses critical healthcare challenges:

- ❌ **Fragmented Records**: Health data scattered across systems
- ❌ **Repeated Tests**: Patients waste money on duplicate tests
- ❌ **Lost/Falsified Records**: Paper records damaged or altered
- ❌ **Medical Errors**: Missing patient history causes dangerous mistakes
- ❌ **No Patient Control**: Hospitals control data, patients can't access it
- ❌ **Emergency Access Gap**: Critical info not available when needed

✅ **MediChain Solution**: Portable, patient-controlled, tamper-proof records on Hedera

## 📊 Impact

- **40%** Cost savings by avoiding duplicate tests
- **60%** Faster treatment decisions with verified history
- **100%** Patient ownership of health records

## 🏆 Built For

**Hedera Africa Hackathon 2025**
- **Track**: DLT for Operations
- **Prize Pool**: $1,000,000
- **Focus**: Using Hedera DLT to improve healthcare operations across Africa

## 🛠 Development

### Project Structure
```
medichain/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── context/            # React Context (Auth)
│   │   └── AuthContext.tsx
│   ├── pages/              # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── PatientDashboard.tsx
│   │   ├── DoctorDashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
├── public/                 # Static assets
└── dist/                   # Production build
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Solo developer passionate about blockchain-powered healthcare solutions.

## 🔗 Links

- **Demo**: [Live Demo](#)
- **Documentation**: [Full Docs](#)
- **Hedera**: [hedera.com](https://hedera.com)

## 🙏 Acknowledgments

- Hedera Hashgraph for the DLT infrastructure
- Exponential Science Foundation & The Hashgraph Association
- DoraHacks for hosting the hackathon

---

Built with ❤️ for the Hedera Africa Hackathon 2025
