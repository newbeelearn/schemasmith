const metadata: Metadata = {
    users: {
        tableMeta: {
            displayName: 'System Users',
        },
        columns: {
            id: {
                label: 'User ID',
                readOnly: true,
            },
            email: {
                label: 'Email Address',
                validation: 'email',
                required: true,
                uiComponent: 'EmailInput',
                prefix: '📧'
            },
        },
    },
    posts: {
        tableMeta: {
          expose: "inout",
        }
    },
    comments: {

    }
};

export default metadata;
