export interface Event {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: 'upcoming' | 'active' | 'completed';
    location: string;
    halls: string[];
    description?: string;
}
export interface PatchData {
    id: string;
    eventId: string;
    hall: string;
    stand: string;
    company: string;
    product: string;
    dv: string;
    asw: string;
    port: string;
    cpeEqu: string;
    info: string;
    status: 'pending' | 'distributed' | 'deployed' | 'returned';
    priority: 'normal' | 'high' | 'urgent';
}
export interface FilterOptions {
    hall?: string;
    status?: string;
    priority?: string;
    company?: string;
}
//# sourceMappingURL=index.d.ts.map