import { Vector } from '../types';
export declare abstract class FunctionalVector<T = any> implements Vector<T>, Iterable<T> {
    abstract get length(): number;
    abstract get(index: number): T;
    iterator(): Generator<T, void, unknown>;
    [Symbol.iterator](): Generator<T, void, unknown>;
    forEach(iterator: (row: T) => void): void;
    map<V>(transform: (item: T, index: number) => V): V[];
    filter<V>(predicate: (item: T) => V): T[];
    toArray(): T[];
    toJSON(): any;
}
/**
 * Use functional programming with your vector
 */
export declare function vectorator<T>(vector: Vector<T>): {
    [Symbol.iterator](): Generator<T, void, unknown>;
    forEach(iterator: (row: T) => void): void;
    map<V>(transform: (item: T, index: number) => V): V[];
    filter<V_1>(predicate: (item: T) => V_1): T[];
};
