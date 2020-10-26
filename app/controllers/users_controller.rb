class UsersController < ApiController
  def index
    @users = User.where.not(id: current_user.id).all
    respond_with @users
  end

  def show
    @user = current_user
    respond_with @user
  end
end
