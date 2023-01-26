import { Web3Button, Web3NetworkSwitch } from '@web3modal/react'

export default function Nav() {
  return (
    <div className="flex h-16 w-full items-center px-4 md:px-12 lg:px-36">
      <h1>Staking Example dApp</h1>
      <div className="ml-auto flex  items-center justify-center gap-1">
        <Web3Button />
      </div>
    </div>
  )
}
