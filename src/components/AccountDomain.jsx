import { useEffect, useState } from 'react'

import { getAccount } from '../services/thegraph'

export function AccountDomain ({ account, stateKey, data, updateData }) {
  const [error] = useState(null)
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    if (account) loadTokens()
  }, [account])

  const loadTokens = async () => {
    setFetched(false)
    const _account = await getAccount(account)
    const _data = {
      ...data,
      [stateKey]: {
        isFetched: true,
        domains: (_account.domains || []).sort((a, b) => {
          return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
        })
      }
    }
    updateData(_data)
    setFetched(true)
  }

  const refresh = () => loadTokens()

  const _domains = data && (data[stateKey] || {}).domains

  return (
    <>
      <h2>Domain Name Account</h2>
      {
        fetched && data[stateKey] && !data[stateKey].domains.length && (
          <p>No domains found for this account</p>
        )
      }
      {
        fetched && data[stateKey] && data[stateKey].domains.length && (
          <table>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Resolver</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {
                _domains.map((domain, index) => (
                  <tr key={index}>
                    <td>{domain.name}</td>
                    <td>{domain.resolver}</td>
                    <td>{domain.owner}</td>
                    <td>
                      <ul>
                        {domain.records && Object.keys(domain.records).map((key, index) => (
                          <li key={index}>{key}: {domain.records[key]}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )
      }

      <div className='container'>
        <button type='button' onClick={refresh}>Refresh</button>
        {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      </div>
    </>
  )
}
