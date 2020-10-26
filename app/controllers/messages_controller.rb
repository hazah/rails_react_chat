class MessagesController < ApiController
  def index
    @channel = Channel.find params[:channel_id]
    @messages = @channel.messages
    respond_with [@channel, @messages]
  end

  def create
    @channel = Channel.find params[:channel_id]
    if @channel.users.find_by id: current_user.id
      @message = @channel.messages.create message_params.merge(user: current_user)
      respond_with @message
    else
      respond_with @channel, status: :unauthorized
    end
  end

  def update
    @message = Message.find params[:id]
    @message.update message_params
    respond_with @message
  end

  def destroy
    @message = Message.find params[:id]
    @message.destroy
    respond_with @message
  end

private

  def message_params
    params.require(:message).permit(:content, :reply_to_id)
  end
end
