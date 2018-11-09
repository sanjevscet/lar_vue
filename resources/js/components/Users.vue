<template>
    <div class="container">
        <div class="row mt-5">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Users</h3>

                        <div class="card-tools">
                            <button class="btn btn-success" @click="newModal">Add New
                                <i class="fas fa-user-plus fa-fw"></i></button>
                            <!-- <button class="btn btn-success" data-toggle="modal" data-target="#addNew">Add New
                                <i class="fas fa-user-plus fa-fw"></i></button> -->
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover">
                            <tbody>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>Registered At</th>
                                    <th>Modify </th>
                                </tr>
                                <tr v-for="user in users" :key="user.id">
                                    <td>{{user.id}}</td>
                                    <td>{{user.name | capitalize}}</td>
                                    <td>{{user.email}}</td>
                                    <td>{{user.type | upText}}</td>
                                    <td>{{user.created_at | myDate}}</td>
                                    <td>
                                        <a href="#" @click="editModal(user)">
                                            <i class="fa fa-edit blue"></i>
                                        </a>
                                        /
                                        <a href="#" @click="deleteUser(user.id)">
                                            <i class="fa fa-trash red"></i>
                                        </a>
                                    </td>                                    
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{editMode ? 'Edit User' :'Add New' }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="editMode ? updateUser() : createUser()">
                        <div class="modal-body">
                            <div class="form-group">
                                <input v-model="form.name" type="text" name="name" placeholder="Name" class="form-control"
                                    :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>

                            <div class="form-group">
                                <input v-model="form.email" type="email" name="email" placeholder="Email Address" class="form-control"
                                    :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>

                            <div class="form-group">
                                <textarea v-model="form.bio" name="bio" id="bio" placeholder="Short bio for user (Optional)"
                                    class="form-control" :class="{'is-invalid': form.errors.has('bio')}"></textarea>
                                <has-error :form="form" field="bio"></has-error>
                            </div>

                            <div class="form-group">
                                <select name="type" id="type" v-model="form.type" class="form-control" :class="{'is-invalid': form.errors.has('type')}">
                                    <option value="">Select User Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">Standard User</option>
                                    <option value="author">Author</option>
                                </select>
                                <has-error :form="form" field="type"></has-error>
                            </div>

                            <div class="form-group">
                                <input v-model="form.password" type="password" name="password" placeholder="Password"
                                    class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                <has-error :form="form" field="password"></has-error>
                            </div>

                        </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        <button v-show="editMode" type="submit" class="btn btn-success">Update</button>
                        <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log("Component mounted.");
        },
        data() {
            return {
                editMode: false,
                users:{},
                form: new Form({
                    id: "",
                    name: "",
                    email: "",
                    password: "",
                    type: "",
                    bio: "",
                    photo: ""
                })
            };
        },
        methods:{
            //to get list os latest 10 users
            loadUsers() {
                axios.get("api/user").then(({data}) => (this.users =data.data) );
            },

            // to create  a new user
            createUser() {
                this.$Progress.start();
                this.form.post('api/user')
                .then(() => {
                    Fire.$emit('refreshList');
                    $("#addNew").modal('hide');
                    toast({
                        type: 'success',
                        title: 'User created successfully'
                    });
                    this.$Progress.finish();
                })
                .catch(() => {
                    toast({
                        type: 'error',
                        title: '!! Something went wrong !!'
                    });
                    this.$Progress.fail();                    
                });                
                //this.form.post('api/user');
            },

            // to create  a new user
            updateUser() {
                this.$Progress.start();
                this.form.put('api/user/'+this.form.id)
                .then(() => {
                    $("#addNew").modal('hide');
                    swal('Updated!', 'Information  has been updated!', 'success');
                    Fire.$emit('refreshList');
                    this.$Progress.finish();
                })
                .catch(() => {
                    toast({
                        type: 'error',
                        title: '!! Something went wrong !!'
                    });
                    this.$Progress.fail();                    
                });                
                //this.form.post('api/user');
            },            
            //delete a user by id
            deleteUser(userId) {
                    swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {
                        if(result.value){
                            this.form.delete('api/user/'+userId).then(() => {
                                //send request to server to delete user
                                Fire.$emit('refreshList');
                                if (result.value) {
                                    swal(
                                    'Deleted!',
                                    'Your file has been deleted.',
                                    'success'
                                    )
                                }
                            }).catch(() => {
                            swal("Failed!", "!!Something went wrong!!", "warning")
                            });
                        }
                    })
            },

            // new modaal to show modal for create
            newModal() {
                this.editMode = false;
                this.form.reset();
                $('#addNew').modal('show');
            },
            // new modaal to show modal for create
            editModal(user) {
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(user);
            }

        },

        // Component is init & call all require methor here.
        created() {
            console.info('User component is added');
            this.loadUsers();
            Fire.$on('refreshList', () => {
                this.loadUsers();
            })
            //setInterval(() => this.loadUsers(), 3000);
        }        
    };
</script>