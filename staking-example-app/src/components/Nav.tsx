import { ConnectKitButton } from 'connectkit'

export default function Nav() {
  return (
    <div className="flex h-16 w-full items-center px-4 md:px-12 lg:px-36">
      <h1>Example Staking DApp</h1>
      <div className="ml-auto flex  items-center justify-center">
        <ConnectKitButton />
      </div>
    </div>
  )
}
