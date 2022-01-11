import { MutationTree, GetterTree, ActionTree, Module } from 'vuex'
import { GenerateActionAugments } from '../../util'
import { RootState } from '../../types'

import { IFeAdminUserType, ISigninType, IUserInfoType } from '../../../../types/admin'

export type State = {
  token: string,
  userinfo: IFeAdminUserType
}

export enum GetterTypes {
  getToken = 'getToken',
  getUserinfo = 'getUserinfo'
}
type GetterMethods = {
  [GetterTypes.getToken] (state: State): string,
  [GetterTypes.getUserinfo] (state: State): IFeAdminUserType,
}
export type Getters = GetterTree<State, RootState> & GetterMethods

export enum MutationTypes {
  setToken = 'setToken',
  setUserinfo = 'setUserinfo'
}
type MutationsMethods = {
  [MutationTypes.setToken] (state: State, value: string): void
  [MutationTypes.setUserinfo] (state: State, value: IFeAdminUserType): void
}
export type Mutations = MutationTree<State> & MutationsMethods

export enum ActionTypes {
  signin = 'signin',
  getUserInfo = 'getUserInfo',
  signout = 'signout'
}
type ActionsMethods = {
  [ActionTypes.signin] (context: GenerateActionAugments<State, Mutations>, payload: ISigninType): Promise<string>
  [ActionTypes.getUserInfo] (context: GenerateActionAugments<State, Mutations>): Promise<IUserInfoType>
  [ActionTypes.signout] (context: GenerateActionAugments<State, Mutations>): Promise<string>
}
export type Actions = ActionTree<State, RootState> & ActionsMethods

export type ModuleType = Module<State, RootState>

