import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import ResolverJSON from 'uns/artifacts/Resolver.json'
import Web3 from 'web3'

import { AccountDomain, HDWalletAccounts } from './components/AccountDomain'

export function App () {
  const [, setSelectedAddress] = useState(null)
  const [error, setError] = useState(null)
  const [account, setAccount] = useState(null)
  const stateKey = `${account}_${80001}`
  const [data, setData] = useState({
    [stateKey]: {
      isFetched: false,
      domains: []
    }
  })

  useEffect(() => {
    connectToMetamask()
  }, [])

  const connectToMetamask = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        window.web3 = new Web3(window.ethereum)
        const response = await window.ethereum.request({ method: 'eth_requestAccounts' }, [])
        const account = response[0]
        setAccount(account)
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      } else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const updateDomainAccountRecords = async ({ address }) => {
    try {
      const domain = data[stateKey].domains[0]
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log('provider', provider)
      const resolver = new ethers.Contract(
        domain.resolver,
        ResolverJSON.abi,
        provider.getSigner()
      )

      await resolver.setMany(
        ['crypto.ETH.address'],
        [address],
        domain.id
      )
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div>
      <h1>HD Wallet UD</h1>

      <HDWalletAccounts
        updateSelectedAddress={setSelectedAddress}
        updateDomainAccountRecords={updateDomainAccountRecords}
      />
      <hr />
      <AccountDomain
        account={account}
        stateKey={stateKey}
        data={data}
        updateData={setData}
      />

      {error && <p>{error}</p>}
    </div>
  )
}
