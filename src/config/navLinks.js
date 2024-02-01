



const General = [
    {
        name: 'Dashboard',
        icon: 'grid',
        link: '',
    },

    {
        name: 'Bookings',
        icon: 'ticket',
        link: '/admin/bookings',
    },

    {
        name: 'Jobs',
        icon: 'box',
        link: '/admin/jobs',
    },

];


const GeneralEnd = [
    {
        name: 'Settings',
        icon: 'gear',
        link: '/admin/settings',
    },
    {
        name: 'Home',
        icon: 'house',
        link: '/',
    },
]

export const AdminLinks = [

    ...General,

    {
        name: 'Users',
        icon: 'people',
        link: '/admin/users',
    },

    {
        name: 'Categories',
        icon: 'stack',
        link: '/admin/categories',
    },

    {
        name: 'Plans',
        icon: 'coin',
        link: '/admin/plans',
    },

    ...GeneralEnd,
];


export const WorkerLinks = [

    ...General,

    {
        name: 'My Profiles',
        icon: 'person',
        link: '/admin/profiles',
    },

    ...GeneralEnd,
];

export const RequesterLinks = [
    ...General,



    {
        name: 'Applications',
        icon: 'boxes',
        link: '/admin/applications',
    },

    ...GeneralEnd,
];