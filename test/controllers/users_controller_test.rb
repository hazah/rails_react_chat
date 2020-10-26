require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  def authenticated_header
    token = Knock::AuthToken.new(payload: { sub: users(:one).id }).token

    {
      'Authorization': "Bearer #{token}",
    }
  end

  test "should get show" do
    get user_url, headers: authenticated_header, as: :json
    assert_response :success
    assert_equal users(:one).id, JSON.parse(@response.body)["id"]
  end

  test "should all other users" do
    get users_url, headers: authenticated_header, as: :json
    assert_response :success
    assert_equal User.where.not(id: users(:one).id).count, JSON.parse(@response.body).length
  end

end
