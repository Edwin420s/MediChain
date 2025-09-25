import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'
import { client } from '../config/hedera.js'
import { PrivateKey, AccountCreateTransaction, AccountId } from '@hashgraph/sdk'

const authController = {
  async register(req, res) {
    try {
      const { email, password, name, role, department, specialization } = req.body

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' })
      }

      // Create Hedera account
      const privateKey = PrivateKey.generate()
      const publicKey = privateKey.publicKey
      
      const transaction = new AccountCreateTransaction()
        .setKey(publicKey)
        .setInitialBalance(100) // 100 tinybars

      const txResponse = await transaction.execute(client)
      const receipt = await txResponse.getReceipt(client)
      const accountId = receipt.accountId

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user in database
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          did: `did:hedera:testnet:${accountId.toString()}`,
          publicKey: publicKey.toString(),
          ...(role === 'PATIENT' && {
            patient: { create: {} }
          }),
          ...(role === 'DOCTOR' && {
            doctor: { 
              create: { 
                specialization,
                department: department ? { connect: { id: department } } : undefined
              } 
            }
          }),
          ...(role === 'ADMIN' && {
            admin: { create: { department } }
          })
        },
        include: { patient: true, doctor: true, admin: true }
      })

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          did: user.did
        },
        token,
        hederaAccount: {
          accountId: accountId.toString(),
          privateKey: privateKey.toString()
        }
      })
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: { patient: true, doctor: true, admin: true }
      })

      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' })
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' })
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          did: user.did
        },
        token
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export default authController