require 'test_helper'

class ChannelsControllerTest < ActionDispatch::IntegrationTest
  def authenticated_header
    token = Knock::AuthToken.new(payload: { sub: users(:one).id }).token

    {
      'Authorization': "Bearer #{token}",
    }
  end

  test "should get index" do
    get channels_url, headers: authenticated_header, as: :json
    assert_response :success
    assert_equal JSON.parse(@response.body).length, Channel.count
  end

end
