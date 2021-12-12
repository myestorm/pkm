import { MutationTree, GetterTree, ActionTree, Module } from 'vuex'
import { GenerateActionAugments } from '../../util'
import { RootState } from '../../types'

import { IRecycleType } from '../../../../app/types/recycle'

export type State = {
  list: IRecycleType[]
}

export enum GetterTypes {
  getList = 'getList'
}
type GetterMethods = {
  [GetterTypes.getList] (state: State): IRecycleType[]
}
export type Getters = GetterTree<State, RootState> & GetterMethods

export enum MutationTypes {
  setList = 'setList'
}
type MutationsMethods = {
  [MutationTypes.setList] (state: State, value: IRecycleType[]): void
}
export type Mutations = MutationTree<State> & MutationsMethods

export enum ActionTypes {
  getList = 'getList',
  removeAll = 'removeAll',
  remove = 'remove'
}
type ActionsMethods = {
  [ActionTypes.getList] (context: GenerateActionAugments<State, Mutations>): Promise<IRecycleType[]>
  [ActionTypes.removeAll] (context: GenerateActionAugments<State, Mutations>): Promise<string>
  [ActionTypes.remove] (context: GenerateActionAugments<State, Mutations>, payload: { kid: string, id: string }): Promise<string>
}
export type Actions = ActionTree<State, RootState> & ActionsMethods

export type ModuleType = Module<State, RootState>

