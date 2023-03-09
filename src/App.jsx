import { useState } from 'react'

export function App () {
  const [mnemonic, setMnemonic] = useState('tag volcano eight thank tide danger coast health above argue embrace heavy')
  const [hdPath, setHdPath] = useState(window.HDWallet.DefaultHDPath)
  const [accounts, setAccounts] = useState([])

  const handleMnemonicChange = (e) => {
    setMnemonic(e.target.value)
  }

  const handleHdPathChange = (e) => {
    setHdPath(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!mnemonic) return
    const wallet = window.HDWallet.fromMnemonic(mnemonic).derive(hdPath)
    const accounts = generateKeys({ hdWallet: wallet })
    setAccounts(accounts)
  }

  const generateKeys = ({ hdWallet }) => {
    const accounts = []
    for (let i = 0; i < 10; i++) {
      const wallet = hdWallet.derive(i) // derive the ith account

      const hdpath = `${wallet.hdpath()}`
      const address = `0x${wallet.getAddress().toString('hex')}`
      const privateKey = `${wallet.getPrivateKey().toString('hex')}`
      const publicKey = `${wallet.getPublicKey().toString('hex')}`

      accounts.push({ hdpath, address, privateKey, publicKey })
    }

    return accounts
  }

  return (
    <div>
      <h1>HD Wallet UD</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='mnemonic'>Mnemonic</label>
          <input
            type='text'
            name='mnemonic'
            id='mnemonic'
            value={mnemonic}
            onChange={handleMnemonicChange}
          />
        </div>

        <div>
          <label htmlFor='hdPath'>HD Path</label>
          <input
            type='text'
            name='hdPath'
            id='hdPath'
            value={hdPath}
            onChange={handleHdPathChange}
          />
        </div>
        <div>
          <button type='submit'>Generate Wallet</button>
        </div>
      </form>

      <div className='table'>
        <h2>Accounts</h2>
        <table>
          <thead>
            <tr>
              <th>HD Path</th>
              <th>Address</th>
              <th>Private Key</th>
              <th>Public Key</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, i) => (
              <tr key={i}>
                <td>{account.hdpath}</td>
                <td>{account.address}</td>
                <td>{account.privateKey}</td>
                <td>{account.publicKey}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
