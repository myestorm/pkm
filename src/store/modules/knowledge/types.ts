import { MutationTree, GetterTree, ActionTree, Module } from 'vuex'
import { GenerateStoreType, GenerateActionAugments } from '../../util'
import { RootState } from '../../types'

import {
  IKnowledgeType,
  IKnowledgeDocType,
  IControllerKnowledgeAddType,
  IStoreKnowledgeUpdateType,
  IStoreKnowledgeDocAddType,
  IStoreKnowledgeDocUpdateType
} from '../../../../types/knowledge'

export type State = {
  list: IKnowledgeType<string>[],
  selected: IKnowledgeType<string> | null
}

export enum GetterTypes {
  getList = 'getList',
  getSelected = 'getSelected'
}
type GetterMethods = {
  [GetterTypes.getList] (state: State): IKnowledgeType<string>[]
  [GetterTypes.getSelected] (state: State): IKnowledgeType<string> | null
}
export type Getters = GetterTree<State, RootState> & GetterMethods

export enum MutationTypes {
  setList = 'setList',
  setSelected = 'setSelected'
}
type MutationsMethods = {
  [MutationTypes.setList] (state: State, value: IKnowledgeType<string>[]): void
  [MutationTypes.setSelected] (state: State, value: IKnowledgeType<string>): void
}
export type Mutations = MutationTree<State> & MutationsMethods

export enum ActionTypes {
  getList = 'getList',
  getInfo = 'getInfo',
  getDocsByid = 'getDocsByid',
  setDefault = 'setDefault',
  add = 'add',
  update = 'update',
  remove = 'remove',
  addDoc = 'addDoc',
  updateDoc = 'updateDoc',
  removeDoc = 'removeDoc',
  transferDoc = 'transferDoc',
  setOrder = 'setOrder',
  setOrderDoc = 'setOrderDoc',
}
type ActionsMethods = {
  [ActionTypes.getList] (context: GenerateActionAugments<State, Mutations>): Promise<IKnowledgeType<string>[]>
  [ActionTypes.getInfo] (context: GenerateActionAugments<State, Mutations>, payload: { id: string, hasChildren?: number }): Promise<IKnowledgeType<string>>
  [ActionTypes.getDocsByid] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<IKnowledgeDocType<string>[]>
  [ActionTypes.setDefault] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<string>
  [ActionTypes.add] (context: GenerateActionAugments<State, Mutations>, payload: IControllerKnowledgeAddType): Promise<string>
  [ActionTypes.update] (context: GenerateActionAugments<State, Mutations>, payload: IStoreKnowledgeUpdateType): Promise<string>
  [ActionTypes.remove] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<string>
  [ActionTypes.addDoc] (context: GenerateActionAugments<State, Mutations>, payload: IStoreKnowledgeDocAddType): Promise<IKnowledgeDocType<string>>
  [ActionTypes.updateDoc] (context: GenerateActionAugments<State, Mutations>, payload: IStoreKnowledgeDocUpdateType): Promise<IKnowledgeDocType<string>>
  [ActionTypes.removeDoc] (context: GenerateActionAugments<State, Mutations>, payload: { kid: string, id: string }): Promise<string>
  [ActionTypes.transferDoc] (context: GenerateActionAugments<State, Mutations>, payload: { fid: string, tid: string, id: string }): Promise<string>
  [ActionTypes.setOrder] (context: GenerateActionAugments<State, Mutations>, payload: { id: string, order: number }): Promise<string>
  [ActionTypes.setOrderDoc] (context: GenerateActionAugments<State, Mutations>, payload: { id: string, did: string, order: number }): Promise<string>
}
export type Actions = ActionTree<State, RootState> & ActionsMethods

export type ModuleType = Module<State, RootState>

// export type KnowledgeStore = GenerateStoreType<Pick<RootState, 'knowledge'>, Mutations, Getter, ActionsMethods>
