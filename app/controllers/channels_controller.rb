class ChannelsController < ApiController
  def index
    @channels = Channel.includes(:users).all
  end

  def show
  end
end
