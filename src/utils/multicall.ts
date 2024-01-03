import { providers, Contract } from 'ethers'
import { Interface } from '@ethersproject/abi'
import MULTICALL_ABI from '../config/abi/multicall.json'
import { contracts, RPC, CHAIN_ID } from '../config/constants'


interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (example: balanceOf)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[] // Function params
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const multicall = async (abi: any[], calls: Call[], chainId?: number) => {
  // eslint-disable-next-line prettier/prettier, no-unused-expressions
  const provider = new providers.JsonRpcProvider(RPC[chainId || CHAIN_ID])
  // eslint-disable-next-line no-useless-catch
  try {
    const multi = new Contract(contracts.multicall[ chainId || CHAIN_ID], MULTICALL_ABI, provider)
    const itf = new Interface(abi)
    const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
    const { returnData } = await multi.callStatic.aggregate(calldata)
    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))
    return res
  } catch (error) {
    throw error
  }
}


export default multicall
