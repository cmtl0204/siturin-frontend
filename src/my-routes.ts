export const MY_ROUTES = {
    home: '',
    layout: {
        base: 'layout'
    },
    errorPages: {
        base: 'errors',
        unauthorized: {
            absolute: '/errors/401',
            base: '401'
        },
        forbidden: {
            absolute: '/errors/403',
            base: '403'
        },
        notFound: {
            absolute: '/errors/404',
            base: '404'
        },
        unavailable: {
            absolute: '/errors/503',
            base: '503'
        }
    },
    corePages: {
        base: 'core',
        absolute: '/main/core',
        dac: {
            base: 'dac',
            absolute: '/main/core/dac',
            dashboard: {
                base: 'dashboard',
                absolute: '/main/core/dac/dashboard'
            },
            project: {
                base: 'projects',
                absolute: '/main/core/dac/projects',
                list: {
                    base: 'projects/list',
                    absolute: '/main/core/dac/projects/list'
                },
                form: {
                    base: 'projects/form',
                    absolute: '/main/core/dac/projects/form'
                },
                document: {
                    base: 'projects/document',
                    absolute: '/main/core/dac/projects/document'
                }
            },
            program: {
                base: 'programs',
                absolute: '/main/core/dac/programs',
                list: {
                    base: 'programs/list',
                    absolute: '/main/core/dac/programs/list'
                },
                form: {
                    base: 'programs/form',
                    absolute: '/main/core/dac/programs/form'
                },
                document: {
                    base: 'programs/document',
                    absolute: '/main/core/dac/programs/document'
                }
            }
        },
        specialist: {
            base: 'specialist',
            absolute: '/main/core/specialist',
            dashboard: {
                base: 'dashboard',
                absolute: '/main/core/specialist/dashboard'
            },
            project: {
                base: 'projects',
                absolute: '/main/core/dac/projects',
                list: {
                    base: 'projects/list',
                    absolute: '/main/core/dac/projects/list'
                },
                form: {
                    base: 'projects/form',
                    absolute: '/main/core/dac/projects/form'
                },
                document: {
                    base: 'projects/document',
                    absolute: '/main/core/dac/projects/document'
                }
            },
            program: {
                base: 'programs',
                absolute: '/main/core/dac/programs',
                list: {
                    base: 'programs/list',
                    absolute: '/main/core/dac/programs/list'
                },
                form: {
                    base: 'programs/form',
                    absolute: '/main/core/dac/programs/form'
                },
                document: {
                    base: 'programs/document',
                    absolute: '/main/core/dac/programs/document'
                }
            }
        },
        gad: {
            base: 'gad',
            absolute: '/main/core/gad',
            dashboard: {
                base: 'dashboard',
                absolute: '/main/core/gad/dashboard'
            },
            project: {
                base: 'projects',
                absolute: '/main/core/dac/projects',
                list: {
                    base: 'projects/list',
                    absolute: '/main/core/dac/projects/list'
                },
                form: {
                    base: 'projects/form',
                    absolute: '/main/core/dac/projects/form'
                },
                document: {
                    base: 'projects/document',
                    absolute: '/main/core/dac/projects/document'
                }
            },
            program: {
                base: 'programs',
                absolute: '/main/core/dac/programs',
                list: {
                    base: 'programs/list',
                    absolute: '/main/core/dac/programs/list'
                },
                form: {
                    base: 'programs/form',
                    absolute: '/main/core/dac/programs/form'
                },
                document: {
                    base: 'programs/document',
                    absolute: '/main/core/dac/programs/document'
                }
            }
        },
        external: {
            base: 'external',
            absolute: '/main/core/external',
            dashboard: {
                base: 'dashboard',
                absolute: '/main/core/external/dashboard'
            },
            accreditation: {
                base: 'accreditations',
                absolute: '/main/core/external/accreditations'
            },
            establishment: {
                base: 'establishments',
                absolute: '/main/core/external/establishments'
            }
        },
        technician: {
            base: 'technician',
            absolute: '/main/core/technician',
            dashboard: {
                base: 'dashboard',
                absolute: '/main/core/technician/dashboard'
            },
            process: {
                base: 'processes',
                absolute: '/main/core/technician/processes',
            },
            program: {
                base: 'programs',
                absolute: '/main/core/dac/programs',
                list: {
                    base: 'programs/list',
                    absolute: '/main/core/dac/programs/list'
                },
                form: {
                    base: 'programs/form',
                    absolute: '/main/core/dac/programs/form'
                },
                document: {
                    base: 'programs/document',
                    absolute: '/main/core/dac/programs/document'
                }
            }
        },
        shared: {
            base: 'shared',
            absolute: '/main/core/shared',
            simulator: {
                base: 'simulators',
                absolute: '/main/core/shared/simulators'
            }
        }
    },
    authPages: {
        base: 'auth',
        signIn: {
            base: 'sign-in',
            absolute: '/auth/sign-in'
        },
        signUp: {
            base: 'sign-up',
            absolute: '/auth/sign-up'
        },
        passwordReset: {
            base: 'password-reset',
            absolute: '/auth/password-reset'
        }
    },
    signIn: '/auth/sign-in',
    dashboards: {
        base: 'dashboards',
        absolute: '/main/dashboards'
    }
};
