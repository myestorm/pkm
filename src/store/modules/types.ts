import { MutationTree, GetterTree, ActionTree } from 'vuex'
import { GenerateStoreType, GenerateActionAugments } from '../util'
import { RootState } from '../types'

export type KnowledgeState = {
  list: number
}

export enum KnowledgeGetterTypes {
  getList = 'GET_LIST'
}
type Getter = {
  [KnowledgeGetterTypes.getList] (state: KnowledgeState): any;
}
export type KnowledgeGetter = GetterTree<KnowledgeState, RootState> & Getter

export enum KnowledgeMutationTypes {
  setList = 'SET_LIST'
}
type Mutations = {
  [KnowledgeMutationTypes.setList] (state: KnowledgeState, value: number): void;
}
export type KnowledgeMutations = MutationTree<KnowledgeState> & Mutations

export enum KnowledgeActionTypes {
  getList = 'GET_LIST'
}
type Actions = {
  [KnowledgeActionTypes.getList] (context: GenerateActionAugments<KnowledgeState, KnowledgeMutations>, payload: Boolean): Promise<any>;
}
export type KnowledgeActions = ActionTree<KnowledgeState, RootState> & Actions

export type KnowledgeStore = GenerateStoreType<Pick<RootState, 'knowledge'>, KnowledgeMutations, KnowledgeGetter, Actions>
