import { defineConfig } from '@wagmi/cli'
import { foundry, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [],
  plugins: [
    react(),
    foundry({
      project: '../staking-example-contracts',
      forge: { clean: true, build: true },
      deployments: {
        StakeToken: {
          5: '0x5602a463b1C124a231261B4A42c0F11C830aACEF',
        },
        ERC20StakingPoolPerpetual: {
          5: '0x1419e30Dea178D0eD0aF8fE56ba1A7820f49A077',
        },
      },
      exclude: [
        // the following patterns are excluded by default
        'Common.sol/**',
        'Components.sol/**',
        'Script.sol/**',
        'StdAssertions.sol/**',
        'StdError.sol/**',
        'StdCheats.sol/**',
        'StdMath.sol/**',
        'StdJson.sol/**',
        'StdStorage.sol/**',
        'StdUtils.sol/**',
        'Vm.sol/**',
        'console.sol/**',
        'console2.sol/**',
        'test.sol/**',
        '**.s.sol/*.json',
        '**.t.sol/*.json',
      ],
      include: ['StakeToken.json', 'ERC20StakingPoolPerpetual.json'],
    }),
  ],
})
