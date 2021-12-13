import { MutationTree, GetterTree, ActionTree, Module } from 'vuex'
import { GenerateStoreType, GenerateActionAugments } from '../../util'
import { RootState } from '../../types'

import { IKnowledgeType, IKnowledgeDocType } from '../../../../app/types/knowledge'

export type State = {
  list: IKnowledgeType[],
  selected: IKnowledgeType | null
}

export enum GetterTypes {
  getList = 'getList',
  getSelected = 'getSelected'
}
type GetterMethods = {
  [GetterTypes.getList] (state: State): IKnowledgeType[]
  [GetterTypes.getSelected] (state: State): IKnowledgeType | null
}
export type Getters = GetterTree<State, RootState> & GetterMethods

export enum MutationTypes {
  setList = 'setList',
  setSelected = 'setSelected'
}
type MutationsMethods = {
  [MutationTypes.setList] (state: State, value: IKnowledgeType[]): void
  [MutationTypes.setSelected] (state: State, value: IKnowledgeType): void
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
}
type ActionsMethods = {
  [ActionTypes.getList] (context: GenerateActionAugments<State, Mutations>): Promise<IKnowledgeType[]>
  [ActionTypes.getInfo] (context: GenerateActionAugments<State, Mutations>, payload: { id: string, hasChildren?: number }): Promise<IKnowledgeType>
  [ActionTypes.getDocsByid] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<IKnowledgeDocType[]>
  [ActionTypes.setDefault] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<string>
  [ActionTypes.add] (context: GenerateActionAugments<State, Mutations>, payload: IKnowledgeType): Promise<string>
  [ActionTypes.update] (context: GenerateActionAugments<State, Mutations>, payload: IKnowledgeType): Promise<string>
  [ActionTypes.remove] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<string>
  [ActionTypes.addDoc] (context: GenerateActionAugments<State, Mutations>, payload: IKnowledgeDocType): Promise<IKnowledgeDocType>
  [ActionTypes.updateDoc] (context: GenerateActionAugments<State, Mutations>, payload: IKnowledgeDocType): Promise<IKnowledgeDocType>
  [ActionTypes.removeDoc] (context: GenerateActionAugments<State, Mutations>, payload: { kid: string, id: string }): Promise<string>
}
export type Actions = ActionTree<State, RootState> & ActionsMethods

export type ModuleType = Module<State, RootState>

// export type KnowledgeStore = GenerateStoreType<Pick<RootState, 'knowledge'>, Mutations, Getter, ActionsMethods>
