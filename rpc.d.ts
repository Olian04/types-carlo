/* tslint:disable */
/**
 * API Documention haven't marked so idk api part.
 * 
 * I've made just using handle for me.
 * so for other methods, please use (any cast)
 */
declare module "carlo/rpc" {
    import { Handle } from "carlo"
    /**
     * https://github.com/GoogleChromeLabs/carlo/blob/master/rpc/rpc.md
     * @param obj Object to handle
     */
    export function handle<T extends object>(obj:T):Handle<T>
}