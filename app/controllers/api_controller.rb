class ApiController < ActionController::API
  include Knock::Authenticable
  self.responder = ApplicationResponder
  respond_to :json
  before_action :authenticate_user
end
