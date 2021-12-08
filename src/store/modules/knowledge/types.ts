import { MutationTree, GetterTree, ActionTree } from 'vuex'
import { GenerateStoreType, GenerateActionAugments } from '../../util'
import { RootState } from '../../types'

import { IKnowledgeType } from '../../../../app/types/knowledge'

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
export type Getter = GetterTree<State, RootState> & GetterMethods

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
  getInfo = 'getInfo'
}
type ActionsMethods = {
  [ActionTypes.getList] (context: GenerateActionAugments<State, Mutations>): Promise<IKnowledgeType[]>
  [ActionTypes.getInfo] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<IKnowledgeType | null>
}
export type Actions = ActionTree<State, RootState> & ActionsMethods

// export type KnowledgeStore = GenerateStoreType<Pick<RootState, 'knowledge'>, Mutations, Getter, ActionsMethods>
